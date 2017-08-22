import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { DatabaseService } from '../../services/database.service';
import { IUserDeck } from '../../models/firebase-models';
import {
  USER_DECKS_START_LISTENING,
  USER_DECKS_STOP_LISTENING,
  IUserDecksAction,
  IUserDecksStartListeningAction,
  IUserDecksStopListeningAction,
  userDecksReceived,
  userDecksError,
} from '../actions/user-decks';
import {
  USER_LOGOUT,
} from '../actions/shared';
import { convertToMap } from './common';
import { IState } from '../state';

export function createUserDecksEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(USER_DECKS_START_LISTENING)
    .mergeMap((action: IUserDecksStartListeningAction) => databaseService.getUserDecks(action.uid)
      .map((userDecks: IUserDeck[]) => userDecksReceived(action.uid, convertToMap(userDecks)))
      .takeUntil(action$
        .ofType(USER_LOGOUT, USER_DECKS_STOP_LISTENING)
        .filter(stopAction => filterStopAction(stopAction, action.uid))
      )
      .catch(err => Observable.of(userDecksError(action.uid, err.message)))
    );
}

function filterStopAction(stopAction: Action, uid: string) : boolean {
  switch (stopAction.type) {
    case USER_LOGOUT:
      return true;

    case USER_DECKS_STOP_LISTENING:
      return (stopAction as IUserDecksStopListeningAction).uid === uid;

    default:
      return false;
  }
}