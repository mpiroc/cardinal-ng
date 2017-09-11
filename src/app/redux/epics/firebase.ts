import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';

import { IState } from '../state';
import { LogService } from '../../services/log.service';
import {
  IUser,
  ICardContent,
  ICardHistory,
  ICard,
  IDeckInfo,
  IDeck,
} from '../../interfaces/firebase';
import {
  FirebaseActions,
  IHasArgs,
  CardContentActions,
  CardHistoryActions,
  CardActions,
  DeckInfoActions,
  DeckActions,
  UserActions,
} from '../actions/firebase';
import { FirebaseObjectReducer } from '../reducers/firebase';

const ARTIFICIAL_LATENCY = 0;

abstract class FirebaseEpic<TModel, TArgs> {
  constructor(protected actions: FirebaseActions<TModel, TArgs>) {
  }

  abstract selectSubStore(state: IState, args: TArgs): Map<string, any>;

  protected isListening(store: MiddlewareAPI<IState>, action: Action & IHasArgs<TArgs>) {
    const subStore: Map<string, any> = this.selectSubStore(store.getState(), action.args);
    const isListening: boolean = !!subStore && subStore.get('isListening');

    return isListening;
  }

  protected filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>): boolean {
    switch (stopAction.type) {
      case this.actions.STOP_LISTENING:
        return (!stopAction.args && !action.args) || JSON.stringify(stopAction.args) === JSON.stringify(action.args);

      default:
        return false;
    }
  }
}

export abstract class FirebaseObjectEpic<TModel, TArgs> extends FirebaseEpic<TModel, TArgs> {
  constructor(actions: FirebaseActions<TModel, TArgs>) {
    super(actions);
  }

  handleReceived(store: MiddlewareAPI<IState>, data: TModel, args: TArgs) {
    return Observable.of(this.actions.objectReceived(args, data));
  }

  public createEpic(logService: LogService, fetch: (args: TArgs) => Observable<TModel>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.BEFORE_START_LISTENING)
      .map(action => action as (Action & IHasArgs<TArgs>))
      .filter(action => !this.isListening(store, action))
      .mergeMap(action => fetch(action.args).delay(ARTIFICIAL_LATENCY)
        .mergeMap((data: TModel) => this.handleReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .startWith(this.actions.startListening(action.args))
        .catch(error => {
          logService.error(error)
          return Observable.of(this.actions.error(action.args, error.message));
        })
      );
  }
}

export abstract class FirebaseListEpic<TModel, TArgs> extends FirebaseEpic<TModel, TArgs> {
  constructor(actions: FirebaseActions<TModel, TArgs>) {
    super(actions);
  }

  abstract selectKey(data: TModel): string;

  abstract getStopActions(masterRecord: TModel): Action[]

  public createEpic(logService: LogService, fetch: (args: TArgs) => Observable<TModel[]>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.BEFORE_START_LISTENING)
      .map(action => action as (Action & IHasArgs<TArgs>))
      .filter(action => !this.isListening(store, action))
      .mergeMap(action => fetch(action.args).delay(ARTIFICIAL_LATENCY)
        .mergeMap((data: TModel[]) => this.handleListReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .startWith(this.actions.startListening(action.args))
        .catch(error => {
          logService.error(error)
          return Observable.of(this.actions.error(action.args, error.message));
        })
      );
  }

  private convertToMap(data: TModel[]): Map<string, TModel> {
    return data.reduce((result, current) => result.set(this.selectKey(current), current), Map<string, TModel>());
  }

  private handleListReceived(store: MiddlewareAPI<IState>, data: TModel[], args: TArgs) {
    const newObjects: Map<string, TModel> = this.convertToMap(data);
    const receivedAction = this.actions.listReceived(args, newObjects);
    const subStore = this.selectSubStore(store.getState(), args);
    const previousObjects: Map<string, TModel> = subStore.get('data');
    if (!previousObjects) {
      return Observable.of(receivedAction);
    }

    const objectsToRemove = previousObjects.valueSeq().filter(
      master => !newObjects.has(this.selectKey(master)));
    const stopListeningActions: Action[] = objectsToRemove
      .map(model => this.getStopActions(model))
      .reduce((accumulator, current) => accumulator.concat(current), []);

    return Observable
      .from(stopListeningActions)
      .startWith(receivedAction);
  }

  public createStopListeningEpic(logService: LogService) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.BEFORE_STOP_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => this.handleStopListening(logService, store, action.args));
  }

  private handleStopListening(logService: LogService, store: MiddlewareAPI<IState>, args: TArgs) {
    const subStore = this.selectSubStore(store.getState(), args);
    const objectsToRemove: Map<string, TModel> = subStore.get('data');
    const stopListeningActions: Action[] = objectsToRemove
      .map(model => this.getStopActions(model))
      .reduce((accumulator, current) => accumulator.concat(current), []);

    return Observable.from(stopListeningActions)
      .catch(error => {
        logService.error(error)
        return Observable.of(this.actions.error(args, error.message));
      });
  }
}

// Epics
@Injectable()
export class CardContentEpic extends FirebaseObjectEpic<ICardContent, ICard> {
  constructor(cardContentActions: CardContentActions) {
    super(cardContentActions);
  }

  selectSubStore(state: IState, args: ICard) {
    return state.cardContent.get(args.cardId);
  }
}

@Injectable()
export class CardHistoryEpic extends FirebaseObjectEpic<ICardHistory, ICard> {
  constructor(cardHistoryActions: CardHistoryActions) {
    super(cardHistoryActions);
  }

  selectSubStore(state: IState, args: ICard) {
    return state.cardHistory.get(args.cardId);
  }
}

@Injectable()
export class DeckInfoEpic extends FirebaseObjectEpic<IDeckInfo, IDeck> {
  constructor(deckInfoActions: DeckInfoActions) {
    super(deckInfoActions);
  }

  selectSubStore(state: IState, args: ICard) {
    return state.deckInfo.get(args.deckId);
  }
}

@Injectable()
export class CardEpic extends FirebaseListEpic<ICard, IDeck> {
  constructor(
    cardActions: CardActions,
    private cardContentActions: CardContentActions,
    private cardHistoryActions: CardHistoryActions,
  ) {
    super(cardActions);
  }

  selectSubStore(state: IState, args: IDeck) {
    return state.card.get(args.deckId);
  }

  selectKey(card: ICard): string {
    return card.cardId;
  }

  getStopActions(card: ICard): Action[] {
    return [
      this.cardContentActions.stopListening(card),
      this.cardHistoryActions.stopListening(card),
    ];
  }
}

@Injectable()
export class DeckEpic extends FirebaseListEpic<IDeck, IUser> {
  constructor(
    deckActions: DeckActions,
    private cardActions: CardActions,
    private deckInfoActions: DeckInfoActions,
  ) {
    super(deckActions);
  }

  selectSubStore(state: IState, args: IUser) {
    return state.deck;
  }

  selectKey(deck: IDeck) {
    return deck.deckId;
  }

  getStopActions(deck: IDeck): Action[] {
    return [
      this.cardActions.beforeStopListening(deck),
      this.cardActions.stopListening(deck),
      this.deckInfoActions.stopListening(deck),
      ];
  }
}

@Injectable()
export class UserEpic extends FirebaseObjectEpic<IUser, {}> {
  constructor(
    private userActions: UserActions,
    private deckActions: DeckActions,
  ) {
    super(userActions);
  }

  selectSubStore(state: IState, args: {}) {
    return state.user;
  }

  handleReceived(store: MiddlewareAPI<IState>, user: IUser, args: {}) {
    let actions: Action[] = [];

    const userStore = store.getState().user;
    const previousUser: Map<string, any> = userStore.get('data');
    if (previousUser && previousUser.get('uid')) {
      const userArgs: IUser = { uid: previousUser.get('uid') };
      actions = actions.concat([
        this.deckActions.beforeStopListening(userArgs),
        this.deckActions.stopListening(userArgs),
      ]);
    }

    actions = actions.concat(this.userActions.objectReceived({}, user));

    if (user) {
      actions = actions.concat(this.deckActions.beforeStartListening(user));
    }

    return Observable.from(actions);
  }
}
