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
import { IState } from '../state';

export function createUserDecksEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(USER_DECKS_START_LISTENING)
    .mergeMap((action: IUserDecksStartListeningAction) => databaseService.getUserDecks(action.uid)
      .map((userDecks: IUserDeck[]) => userDecksReceived(action.uid, convertToMap(userDecks)))
      .takeUntil(action$.ofType(USER_LOGOUT))
      .catch(err => Observable.of(userDecksError(action.uid, err.message)))
    );
}

function convertToMap(userDecks: IUserDeck[]) : Map<string, IUserDeck> {
  return userDecks.reduce(
    (result, current) => result.set(current.$key, current),
    Map<string, IUserDeck>());
}