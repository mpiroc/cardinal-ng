import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';

import { IUser } from '../../interfaces/firebase';
import { IState } from '../state';
import { LogService } from '../../services/log.service';
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

export class FirebaseObjectEpic<TModel, TArgs> {
  constructor(
    private actions: FirebaseActions<TModel, TArgs>,
    private handleReceived?: (store: MiddlewareAPI<IState>, data: TModel, args: TArgs) => Observable<Action>) {
    
    if (!handleReceived) {
      this.handleReceived = (store, data, args) => Observable.of(this.actions.objectReceived(args, data));
    }
  }

  public createEpic(logService: LogService, fetch: (args: TArgs) => Observable<TModel>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.START_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => fetch(action.args)
        .mergeMap((data: TModel) => this.handleReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .catch(error => {
          logService.error(error)
          return Observable.of(this.actions.error(action.args, error.message));
        })
      );
  }

  private filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>) : boolean {
    switch (stopAction.type) {
      case this.actions.STOP_LISTENING:
        return (!stopAction.args && !action.args) || JSON.stringify(stopAction.args) === JSON.stringify(action.args);

      default:
        return false;
    }
  }
}

export class FirebaseListEpic<TModel, TArgs> {
  constructor(
    private actions: FirebaseActions<TModel, TArgs>,
    private selectKey: (data: TModel) => string,
    private selectSubStore: (state: IState, args: TArgs) => Map<string, any>,
    private getStopActions: (masterRecord: TModel) => Action[]) {
  }

  public createEpic(logService: LogService, fetch: (args: TArgs) => Observable<TModel[]>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.START_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => fetch(action.args)
        .mergeMap((data: TModel[]) => this.handleListReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .catch(error => {
          logService.error(error)
          return Observable.of(this.actions.error(action.args, error.message));
        })
      );
  }

  private convertToMap(data: TModel[]) : Map<string, TModel> {
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
      .map(this.getStopActions)
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
      .map(this.getStopActions)
      .reduce((accumulator, current) => accumulator.concat(current), []);

    return Observable.from(stopListeningActions)
      .catch(error => {
        logService.error(error)
        return Observable.of(this.actions.error(args, error.message));
      });
  }

  private filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>) : boolean {
    switch (stopAction.type) {
      case this.actions.STOP_LISTENING:
        return (!stopAction.args && !action.args) || JSON.stringify(stopAction.args) === JSON.stringify(action.args);

      default:
        return false;
    }
  }
}

// Epics
export const CardContentEpic = new FirebaseObjectEpic(CardContentActions);
export const CardHistoryEpic = new FirebaseObjectEpic(CardHistoryActions);
export const DeckInfoEpic = new FirebaseObjectEpic(DeckInfoActions);

export const CardEpic = new FirebaseListEpic(
  CardActions,
  card => card.cardId,
  (state, args) => state.card.get(args.deckId),
  card => [
    CardContentActions.stopListening(card),
    CardHistoryActions.stopListening(card),
  ],
);

export const DeckEpic = new FirebaseListEpic(
  DeckActions,
  deck => deck.deckId,
  (state, args) => state.deck,
  deck => [
    CardActions.beforeStopListening(deck),
    CardActions.stopListening(deck),
    DeckInfoActions.stopListening(deck),
  ],
);

export const UserEpic = new FirebaseObjectEpic(UserActions, (store, user, args) => {
  let actions: Action[] = [];

  const userStore = store.getState().user;
  const previousUser: Map<string, any> = userStore.get('data');
  if (previousUser && previousUser.get('uid')) {
    const args: IUser = { uid: previousUser.get('uid') };
    actions = actions.concat([
      DeckActions.beforeStopListening(args),
      DeckActions.stopListening(args),
    ]);
  }

  actions = actions.concat(UserActions.objectReceived({}, user));

  if (user) {
    actions = actions.concat(DeckActions.startListening(user));
  }

  return Observable.from(actions);
});