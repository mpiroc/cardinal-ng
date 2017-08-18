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
import { IDeckInfo } from '../../models/firebase-models';
import {
  DECK_INFO_START_LISTENING,
  DECK_INFO_STOP_LISTENING,
  IDeckInfoAction,
  IDeckInfoStartListeningAction,
  IDeckInfoStopListeningAction,
  deckInfoReceived,
  deckInfoError,
} from '../actions/deck-info';
import {
  USER_LOGOUT,
} from '../actions/shared';

export function createDeckInfoEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<Map<string, any>>) => action$
    .ofType(DECK_INFO_START_LISTENING)
    .mergeMap((action: IDeckInfoStartListeningAction) => databaseService.getDeckInfo(action.uid, action.deckId)
      .map((deckInfo: IDeckInfo) => deckInfoReceived(deckInfo.uid, deckInfo.$key, deckInfo.name, deckInfo.description))
      .takeUntil(action$
        .ofType(USER_LOGOUT, DECK_INFO_STOP_LISTENING)
        .filter(stopAction => filterStopAction(action, stopAction))
      )
      .catch(err => Observable.of(deckInfoError(action.uid, action.deckId, err.message)))
    );
}

function filterStopAction(action: IDeckInfoAction, stopAction: Action): boolean {
  switch (stopAction.type) {
    case USER_LOGOUT:
      return true;
    
    case DECK_INFO_STOP_LISTENING:
      const typedStopAction = stopAction as IDeckInfoStopListeningAction;
      return typedStopAction.deckId === action.deckId;

    default:
      return false;
  }
}