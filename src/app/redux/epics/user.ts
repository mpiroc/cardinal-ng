import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { AuthService } from '../../services/auth.service';
import {
  USER_START_LISTENING,
  USER_STOP_LISTENING,
  IUserStartListeningAction,
  IUserStopListeningAction,
  userReceived,
  userError,
} from '../actions/user';
import {
  userDecksStartListening,
} from '../actions/user-decks';
import {
  userLogout,
} from '../actions/shared';
import { IState } from '../state';

export function createUserEpic(authService: AuthService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(USER_START_LISTENING)
    .mergeMap((action: IUserStartListeningAction) => authService.user$
      .mergeMap(user => handleUserReceived(store, user))
      .takeUntil(action$.ofType(USER_STOP_LISTENING))
      .catch(err => Observable.of(userError(err.message as string)))
    );
}

function handleUserReceived(store: MiddlewareAPI<IState>, user: firebase.User) : Observable<Action> {
  if (user === null) {
    return Observable.of(
      userLogout(),
      userReceived(null, null),
    );
  }

  return Observable.of<Action>(
    userLogout(),
    userReceived(user.uid, user.displayName),
    userDecksStartListening(user.uid),
  );
}