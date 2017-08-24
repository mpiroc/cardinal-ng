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
    private stopActions: string[],
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
          .ofType(this.stopActions.concat(this.actions.STOP_LISTENING))
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .catch(err => {
          console.error(err);
          return Observable.of(this.actions.error(action.args, err.message))
        })
      );
  }

  private filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>) : boolean {
    if (this.stopActions.find(stopAction.type)) {
      return true;
    }

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
    private stopActions: string[],
    private handleReceived?: (store: MiddlewareAPI<IState>, data: TModel[], args: TArgs) => Observable<Action>) {
    if (!handleReceived) {
      this.handleReceived = (store, data, args) => Observable.of(this.actions.listReceived(args, this.convertToMap(data)));
    }
  }

  public createEpic(fetch: (args: TArgs) => Observable<TModel[]>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.START_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => fetch(action.args)
        .mergeMap((data: TModel[]) => this.handleReceived(store, data, action.args))
        .takeUntil(action$
          .ofType(this.stopActions.concat(this.actions.STOP_LISTENING))
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
        .catch(err => {
          console.error(err);
          return Observable.of(this.actions.error(action.args, err.message))
        })
      );
  }

  private filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>) : boolean {
    if (this.stopActions.find(stopAction.type)) {
      return true;
    }

    switch (stopAction.type) {
      case this.actions.STOP_LISTENING:
        return JSON.stringify(stopAction.args) === JSON.stringify(action.args);

      default:
        return false;
    }
  }

  public convertToMap(data: TModel[]) : Map<string, TModel> {
    return data.reduce((result, current) => result.set(current.$key, current), Map<string, TModel>());
  }
}
