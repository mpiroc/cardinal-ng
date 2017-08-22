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
import { IDeckInfo, IUserDeck } from '../../models/firebase-models';
import {
  DECK_INFO_START_LISTENING,
  DECK_INFO_STOP_LISTENING,
  IDeckInfoAction,
  IDeckInfoStartListeningAction,
  IDeckInfoStopListeningAction,
  deckInfoStopListening,
  deckInfoReceived,
  deckInfoError,
} from '../actions/deck-info';
import {
  USER_DECKS_RECEIVED,
  IUserDecksReceivedAction,
} from '../actions/user-decks';
import {
  USER_LOGOUT,
} from '../actions/shared';
import { IState } from '../state';

export function createDeckInfoEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(DECK_INFO_START_LISTENING)
    .mergeMap((action: IDeckInfoStartListeningAction) => databaseService.getDeckInfo(action.uid, action.deckId)
      .map((deckInfo: IDeckInfo) => deckInfoReceived(action.uid, action.deckId, deckInfo))
      .takeUntil(action$
        .ofType(USER_LOGOUT, DECK_INFO_STOP_LISTENING)
        .filter(stopAction => filterStopAction(stopAction, action.deckId))
      )
      .catch(err => Observable.of(deckInfoError(action.uid, action.deckId, err.message)))
    );
}

export function createDeckInfoCleanupEpic() {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(USER_DECKS_RECEIVED)
    .mergeMap((action: IUserDecksReceivedAction) => store.getState().userDecks.get("data")
      .filterNot((userDeck: IUserDeck) => action.data.has(userDeck.$key))
      .map(deckId => deckInfoStopListening(action.uid, deckId))
      .toArray()
    );
}

function filterStopAction(stopAction: Action, deckId: string): boolean {
  switch (stopAction.type) {
    case USER_LOGOUT:
      return true;
    
    case DECK_INFO_STOP_LISTENING:
      const typedStopAction = stopAction as IDeckInfoStopListeningAction;
      return typedStopAction.deckId === deckId;

    default:
      return false;
  }
}