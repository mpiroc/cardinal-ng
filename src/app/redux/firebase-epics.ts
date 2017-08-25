import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { IState } from './state';
import { IFirebaseModel } from '../models/firebase-models';
import { FirebaseActions, IHasArgs } from './firebase-actions';
import { FirebaseObjectReducer } from './firebase-reducers';

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
      .ofType(this.actions.STOP_LISTENING)
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
  selectSubStore: (state: IState) => Map<string, any>,
  getStopActions: (masterRecord: TModel) => Action[],
) {
  return (store: MiddlewareAPI<IState>, data: TModel[], args: TArgs) => {
    const newObjects: Map<string, TModel> = convertToMap(data);
    const receivedAction = actions.listReceived(args, newObjects);
    const subStore = selectSubStore(store.getState());
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
  selectSubStore: (state: IState) => Map<string, any>,
  getStopActions: (masterRecord: TModel) => Action[],
) {
  return (store: MiddlewareAPI<IState>, args: TArgs) => {
    const subStore = selectSubStore(store.getState());
    const objectsToRemove = subStore.get('data');
    const stopListeningActions: Action[] = objectsToRemove
      .map(getStopActions)
      .reduce((accumulator, current) => accumulator.concat(current), []);

    return Observable.from(stopListeningActions);
  }
}