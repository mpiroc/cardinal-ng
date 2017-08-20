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
  IUserDecksAction,
  IUserDecksStartListeningAction,
  userDecksReceived,
  userDecksError,
} from '../actions/user-decks';
import {
  USER_LOGOUT,
} from '../actions/shared';

export function createUserDecksEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<Map<string, any>>) => action$
    .ofType(USER_DECKS_START_LISTENING)
    .mergeMap((action: IUserDecksStartListeningAction) => databaseService.getUserDecks(action.uid)
      .map((userDecks: IUserDeck[]) => userDecksReceived(action.uid, userDecks.map(userDeck => userDeck.$key)))
      .takeUntil(action$.ofType(USER_LOGOUT))
    );
}