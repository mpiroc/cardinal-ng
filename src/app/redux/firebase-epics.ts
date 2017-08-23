import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { IState } from './state';
import { IFirebaseModel } from '../models/firebase-models';
import { FirebaseActions, IHasArgs } from './firebase-actions';
import { FirebaseItemReducer } from './firebase-reducers';
import { USER_LOGOUT } from './actions/shared';

export class FirebaseItemEpic<TModel extends IFirebaseModel, TArgs> {
  constructor(private actions: FirebaseActions<TModel, TArgs>) {
  }

  public createEpic(fetch: (args: TArgs) => FirebaseObjectObservable<TModel>) {
    return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
      .ofType(this.actions.START_LISTENING)
      .mergeMap((action: Action & IHasArgs<TArgs>) => fetch(action.args)
        .map((data: TModel) => this.actions.received(action.args, data))
        // TODO: Also stop listening when item is removed from its master list (i.e. userDecks, deckCards)
        .takeUntil(action$
          .ofType(USER_LOGOUT, this.actions.STOP_LISTENING)
          .filter(stopAction => this.filterStopAction(stopAction as Action & IHasArgs<TArgs>, action))
        )
      );
  }

  private filterStopAction(stopAction: Action & IHasArgs<TArgs>, action: Action & IHasArgs<TArgs>) : boolean {
    switch (stopAction.type) {
      case USER_LOGOUT:
        return true;

      case this.actions.STOP_LISTENING:
        return JSON.stringify(stopAction.args) === JSON.stringify(action.args);

      default:
        return false;
    }
  }
}