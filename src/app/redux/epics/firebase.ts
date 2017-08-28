import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { IState } from '../state';
import {
  IUserArgs,
  IDeckArgs,
  ICardArgs,
  IFirebaseModel,
  IUser,
  IDeckCard,
  IUserDeck,
} from '../../interfaces/firebase';
import {
  FirebaseActions,
  IHasArgs,
  CardContentActions,
  CardHistoryActions,
  DeckCardActions,
  DeckInfoActions,
  UserDeckActions,
  UserActions,
} from '../actions/firebase';
import { FirebaseObjectReducer } from '../reducers/firebase';

export class FirebaseObjectEpic<TModel extends IFirebaseModel, TArgs> {
  constructor(
    private actions: FirebaseActions<TModel, TArgs>,
    private handleReceived?: (store: MiddlewareAPI<IState>, data: TModel, args: TArgs) => Observable<Action>) {
    
    if (!handleReceived) {
      this.handleReceived = (store, data, args) => Observable.of(this.actions.objectReceived(args, data));
    }
  }

  public createEpic(fetch: (args: TArgs) => Observable<TModel>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.START_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => fetch(action.args)
        .mergeMap((data: TModel) => this.handleReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .catch(err => {
          console.error(err);
          return Observable.of(this.actions.error(action.args, err.message))
        })
      );
  }

  private filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>) : boolean {
    switch (stopAction.type) {
      case this.actions.STOP_LISTENING:
        return JSON.stringify(stopAction.args) === JSON.stringify(action.args);

      default:
        return false;
    }
  }
}

export class FirebaseListEpic<TModel extends IFirebaseModel, TArgs> {
  constructor(
    private actions: FirebaseActions<TModel, TArgs>,
    private handleReceived: (store: MiddlewareAPI<IState>, data: TModel[], args: TArgs) => Observable<Action>,
    private handleStopListening: (store: MiddlewareAPI<IState>, args: TArgs) => Observable<Action>) {
  }

  public createEpic(fetch: (args: TArgs) => Observable<TModel[]>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.START_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => fetch(action.args)
        .mergeMap((data: TModel[]) => this.handleReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .catch(err => {
          console.error("Error in epic for action " + action.type);
          console.error(err);
          return Observable.of(this.actions.error(action.args, err.message))
        })
      );
  }

  public createStopListeningEpic() {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.BEFORE_STOP_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => this.handleStopListening(store, action.args));
  }

  private filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>) : boolean {
    switch (stopAction.type) {
      case this.actions.STOP_LISTENING:
        return JSON.stringify(stopAction.args) === JSON.stringify(action.args);

      default:
        return false;
    }
  }
}

function convertToMap<TModel extends IFirebaseModel>(data: TModel[]) : Map<string, TModel> {
  return data.reduce((result, current) => result.set(current.$key, current), Map<string, TModel>());
}

export function createListReceivedHandler<TModel extends IFirebaseModel, TArgs>(
  actions: FirebaseActions<TModel, TArgs>,
  selectSubStore: (state: IState, args: TArgs) => Map<string, any>,
  getStopActions: (masterRecord: TModel) => Action[],
) {
  return (store: MiddlewareAPI<IState>, data: TModel[], args: TArgs) => {
    const newObjects: Map<string, TModel> = convertToMap(data);
    const receivedAction = actions.listReceived(args, newObjects);
    const subStore = selectSubStore(store.getState(), args);
    const previousObjects: Map<string, TModel> = subStore.get('data');
    if (!previousObjects) {
      return Observable.of(receivedAction);
    }

    const objectsToRemove = previousObjects.valueSeq().filter(masterRecord => !newObjects.has(masterRecord.$key));
    const stopListeningActions: Action[] = objectsToRemove
      .map(getStopActions)
      .reduce((accumulator, current) => accumulator.concat(current), []);
    
    return Observable
      .from(stopListeningActions)
      .startWith(receivedAction);
  }
}

export function createStopListeningHandler<TModel extends IFirebaseModel, TArgs>(
  actions: FirebaseActions<TModel, TArgs>,
  selectSubStore: (state: IState, args: TArgs) => Map<string, any>,
  getStopActions: (masterRecord: TModel) => Action[],
) {
  return (store: MiddlewareAPI<IState>, args: TArgs) => {
    const subStore = selectSubStore(store.getState(), args);
    const objectsToRemove = subStore.get('data');
    const stopListeningActions: Action[] = objectsToRemove
      .map(getStopActions)
      .reduce((accumulator, current) => accumulator.concat(current), []);

    return Observable.from(stopListeningActions);
  }
}

// Epics
export const CardContentEpic = new FirebaseObjectEpic(CardContentActions);
export const CardHistoryEpic = new FirebaseObjectEpic(CardHistoryActions);
export const DeckInfoEpic = new FirebaseObjectEpic(DeckInfoActions);
export const DeckCardEpic = new FirebaseListEpic(DeckCardActions,
  createListReceivedHandler(DeckCardActions, deckCardSelectStore, deckCardStopListening),
  createStopListeningHandler(DeckCardActions, deckCardSelectStore, deckCardStopListening),
);
export const UserDeckEpic = new FirebaseListEpic(UserDeckActions,
  createListReceivedHandler(UserDeckActions, userDeckSelectStore, userDeckStopListening),
  createStopListeningHandler(UserDeckActions, userDeckSelectStore, userDeckStopListening),
);
export const UserEpic = new FirebaseObjectEpic(UserActions, userHandleReceived);

// Helpers
function deckCardStopListening(deckCard: IDeckCard) {
  const args = {
    uid: deckCard.uid,
    deckId: deckCard.deckId,
    cardId: deckCard.$key,
  }
  return [
    CardContentActions.stopListening(args),
    CardHistoryActions.stopListening(args),
  ];
}

function deckCardSelectStore(state: IState, args: IDeckArgs) {
  return state.deckCard.get(args.deckId);
}

function userDeckStopListening(userDeck: IUserDeck) {
  const args = {
    uid: userDeck.uid,
    deckId: userDeck.$key,
  };
  return [
    DeckCardActions.beforeStopListening(args),
    DeckCardActions.stopListening(args),
    DeckInfoActions.stopListening(args),
  ];
}

function userDeckSelectStore(state: IState, args: IUserArgs) {
  return state.userDeck;
}

function userHandleReceived(store: MiddlewareAPI<IState>, data: IUser, args: IUserArgs) : Observable<Action> {
  let actions: Action[] = [];

  const userStore = store.getState().user;
  const previousUser = userStore.get('data');
  if (previousUser && previousUser.get('uid')) {
    const args: IUserArgs = { uid: previousUser.get('uid') };
    actions = actions.concat([
      UserDeckActions.beforeStopListening(args),
      UserDeckActions.stopListening(args),
    ]);
  }

  actions = actions.concat(UserActions.objectReceived({}, data));

  if (data) {
    actions = actions.concat(UserDeckActions.startListening({ uid: data.uid }));
  }

  return Observable.from(actions);
} 