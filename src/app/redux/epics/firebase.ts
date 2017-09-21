import { Injectable } from '@angular/core'
import { Map } from 'immutable'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/takeUntil'
import { Action, MiddlewareAPI } from 'redux'
import { ActionsObservable } from 'redux-observable'
import { AngularFireAuth } from 'angularfire2/auth'

import { IState } from '../state'
import { DatabaseService } from '../../services/firebase/database.service'
import { AuthShimService } from '../../services/firebase/auth-shim.service'
import { LogService } from '../../services/log.service'
import {
  IUser,
  ICardContent,
  ICardHistory,
  ICard,
  IDeckInfo,
  IDeck,
} from '../../interfaces/firebase'
import {
  FirebaseActions,
  IHasArgs,
  CardContentActions,
  CardHistoryActions,
  CardActions,
  DeckInfoActions,
  DeckActions,
  UserActions,
} from '../actions/firebase'
import { FirebaseObjectReducer } from '../reducers/firebase'

const ARTIFICIAL_LATENCY = 2000

abstract class FirebaseEpic<TModel, TArgs> {
  protected constructor(protected actions: FirebaseActions<TModel, TArgs>) {
  }

  protected abstract selectSubStore(state: IState, args: TArgs): Map<string, any>

  protected isListening(store: MiddlewareAPI<IState>, action: Action & IHasArgs<TArgs>) {
    const subStore: Map<string, any> = this.selectSubStore(store.getState(), action.args)
    const isListening: boolean = !!subStore && subStore.get('isListening')

    return isListening
  }

  protected filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>): boolean {
    switch (stopAction.type) {
      case this.actions.STOP_LISTENING:
        return (!stopAction.args && !action.args) || JSON.stringify(stopAction.args) === JSON.stringify(action.args)

      default:
        return false
    }
  }
}

export abstract class FirebaseObjectEpic<TModel, TArgs> extends FirebaseEpic<TModel, TArgs> {
  public readonly epic: (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => Observable<Action>

  protected constructor(
    actions: FirebaseActions<TModel, TArgs>,
    private logService: LogService,
  ) {
    super(actions)
    this.epic = this._epic.bind(this)
  }

  protected abstract fetch(args: TArgs): Observable<TModel>

  private _epic(action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>): Observable<Action> {
    return action$
      .ofType(this.actions.BEFORE_START_LISTENING)
      .map(action => action as (Action & IHasArgs<TArgs>))
      .filter(action => !this.isListening(store, action))
      .mergeMap(action => this.fetch(action.args) // .delay(ARTIFICIAL_LATENCY)
        .mergeMap((data: TModel) => this.handleReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .startWith(this.actions.startListening(action.args))
        .catch(error => {
          this.logService.error(error.message)
          return Observable.of(this.actions.error(action.args, error.message))
        })
      )
  }

  protected handleReceived(store: MiddlewareAPI<IState>, data: TModel, args: TArgs): Observable<Action> {
    return Observable.of(this.actions.objectReceived(args, data))
  }
}

export abstract class FirebaseListEpic<TModel, TArgs> extends FirebaseEpic<TModel, TArgs> {
  public readonly epic: (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => Observable<Action>
  public readonly stopListeningEpic: (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => Observable<Action>

  protected constructor(
    actions: FirebaseActions<TModel, TArgs>,
    private logService: LogService,
  ) {
    super(actions)
    this.epic = this._epic.bind(this)
    this.stopListeningEpic = this._stopListeningEpic.bind(this)
  }

  protected abstract selectKey(data: TModel): string

  protected abstract getStopActions(masterRecord: TModel): Action[]

  protected abstract fetch(args: TArgs): Observable<TModel[]>

  private _epic(action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>): Observable<Action> {
    return action$
      .ofType(this.actions.BEFORE_START_LISTENING)
      .map(action => action as (Action & IHasArgs<TArgs>))
      .filter(action => !this.isListening(store, action))
      .mergeMap(action => this.fetch(action.args) // .delay(ARTIFICIAL_LATENCY)
        .mergeMap((data: TModel[]) => this.handleListReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .startWith(this.actions.startListening(action.args))
        .catch(error => {
          this.logService.error(error.message)
          return Observable.of(this.actions.error(action.args, error.message))
        })
      )
  }

  private handleListReceived(store: MiddlewareAPI<IState>, data: TModel[], args: TArgs): Observable<Action> {
    const receivedAction = this.actions.listReceived(args, data)
    const newObjects = data.reduce((accumulator, current) => {
      accumulator[this.selectKey(current)] = true
      return accumulator
    }, {})
    const subStore = this.selectSubStore(store.getState(), args)
    const previousObjects: Map<string, TModel> = subStore ? subStore.get('data') : undefined
    if (!previousObjects) {
      return Observable.of(receivedAction)
    }

    const objectsToRemove = previousObjects.valueSeq().filter(
      master => !newObjects[this.selectKey(master)]
    )
    const stopListeningActions: Action[] = objectsToRemove
      .map(model => this.getStopActions(model))
      .reduce((accumulator, current) => accumulator.concat(current), [])

    return Observable
      .from(stopListeningActions)
      .startWith(receivedAction)
  }

  private _stopListeningEpic(action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>): Observable<Action> {
    return action$
      .ofType(this.actions.BEFORE_STOP_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => this.handleStopListening(store, action.args))
  }

  private handleStopListening(store: MiddlewareAPI<IState>, args: TArgs) {
    const subStore = this.selectSubStore(store.getState(), args)
    const objectsToRemove: Map<string, TModel> = subStore.get('data')
    const stopListeningActions: Action[] = objectsToRemove ? objectsToRemove
      .map(model => this.getStopActions(model))
      .reduce((accumulator, current) => accumulator.concat(current), [])
      : []

    return Observable.from(stopListeningActions)
      .startWith(this.actions.stopListening(args))
      .catch(error => {
        this.logService.error(error.message)
        return Observable.of(this.actions.error(args, error.message))
      })
  }
}

// Epics
@Injectable()
export class CardContentEpic extends FirebaseObjectEpic<ICardContent, ICard> {
  constructor(
    cardContentActions: CardContentActions,
    logService: LogService,
    private databaseService: DatabaseService,
  ) {
    super(cardContentActions, logService)
  }

  protected selectSubStore(state: IState, args: ICard) {
    return state.cardContent.get(args.cardId)
  }

  protected fetch(args: ICard): Observable<ICardContent> {
    return this.databaseService.getCardContent(args)
  }
}

@Injectable()
export class CardHistoryEpic extends FirebaseObjectEpic<ICardHistory, ICard> {
  constructor(
    cardHistoryActions: CardHistoryActions,
    logService: LogService,
    private databaseService: DatabaseService,
  ) {
    super(cardHistoryActions, logService)
  }

  protected selectSubStore(state: IState, args: ICard) {
    return state.cardHistory.get(args.cardId)
  }

  protected fetch(args: ICard): Observable<ICardHistory> {
    return this.databaseService.getCardHistory(args)
  }
}

@Injectable()
export class DeckInfoEpic extends FirebaseObjectEpic<IDeckInfo, IDeck> {
  constructor(
    deckInfoActions: DeckInfoActions,
    logService: LogService,
    private databaseService: DatabaseService,
  ) {
    super(deckInfoActions, logService)
  }

  protected selectSubStore(state: IState, args: ICard) {
    return state.deckInfo.get(args.deckId)
  }

  protected fetch(args: IDeck): Observable<IDeckInfo> {
    return this.databaseService.getDeckInfo(args)
  }
}

@Injectable()
export class CardEpic extends FirebaseListEpic<ICard, IDeck> {
  constructor(
    cardActions: CardActions,
    private cardContentActions: CardContentActions,
    private cardHistoryActions: CardHistoryActions,
    logService: LogService,
    private databaseService: DatabaseService,
  ) {
    super(cardActions, logService)
  }

  protected selectSubStore(state: IState, args: IDeck) {
    return state.card.get(args.deckId)
  }

  protected selectKey(card: ICard): string {
    return card.cardId
  }

  protected getStopActions(card: ICard): Action[] {
    return [
      this.cardContentActions.stopListening(card),
      this.cardHistoryActions.stopListening(card),
    ]
  }

  protected fetch(args: IDeck): Observable<ICard[]> {
    return this.databaseService.getCards(args)
  }
}

@Injectable()
export class DeckEpic extends FirebaseListEpic<IDeck, IUser> {
  constructor(
    deckActions: DeckActions,
    private cardActions: CardActions,
    private deckInfoActions: DeckInfoActions,
    logService: LogService,
    private databaseService: DatabaseService,
  ) {
    super(deckActions, logService)
  }

  protected selectSubStore(state: IState, args: IUser) {
    return state.deck
  }

  protected selectKey(deck: IDeck) {
    return deck.deckId
  }

  protected getStopActions(deck: IDeck): Action[] {
    return [
      this.cardActions.beforeStopListening(deck),
      this.deckInfoActions.stopListening(deck),
    ]
  }

  protected fetch (args: IUser): Observable<IDeck[]> {
    return this.databaseService.getDecks(args)
  }
}

@Injectable()
export class UserEpic extends FirebaseObjectEpic<IUser, {}> {
  constructor(
    private userActions: UserActions,
    private deckActions: DeckActions,
    logService: LogService,
    private authShimService: AuthShimService,
  ) {
    super(userActions, logService)
  }

  protected selectSubStore(state: IState, args: {}) {
    return state.user
  }

  protected handleReceived(store: MiddlewareAPI<IState>, user: IUser, args: {}) {
    let actions: Action[] = []

    const userStore = store.getState().user
    const previousUser: Map<string, any> = userStore.get('data')
    if (previousUser && previousUser.get('uid')) {
      const userArgs: IUser = { uid: previousUser.get('uid') }
      actions = actions.concat([
        this.deckActions.beforeStopListening(userArgs),
      ])
    }

    actions = actions.concat(this.userActions.objectReceived({}, user))

    if (user) {
      actions = actions.concat(this.deckActions.beforeStartListening(user))
    }

    return Observable.from(actions)
  }

  protected fetch(args: {}): Observable<IUser> {
    return this.authShimService.getUser()
  }
}
