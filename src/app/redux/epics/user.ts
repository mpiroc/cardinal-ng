import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
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
  userLogout,
} from '../actions/shared';

export function createUserStartListeningEpic(authService: AuthService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<Map<string, any>>) => action$
    .ofType(USER_START_LISTENING)
    .switchMap((action: IUserStartListeningAction) => authService.user$
      .switchMap(handleUserReceived)
      .takeUntil(action$.ofType(USER_STOP_LISTENING))
      .catch(handleUserError)
    );
}

function handleUserReceived(user: firebase.User) : Observable<Action> {
  if (user === null) {
    return Observable.of(
      userLogout(),
      userReceived(null, null),
    );
  }

  return Observable.of(userReceived(user.uid, user.displayName));
}

function handleUserError(err) : Observable<Action> {
  return Observable.of(userError(err.message as string));
}