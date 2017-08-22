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
import { IDeckCard } from '../../models/firebase-models';
import {
  DECK_CARDS_START_LISTENING,
  DECK_CARDS_STOP_LISTENING,
  IDeckCardsAction,
  IDeckCardsStartListeningAction,
  IDeckCardsStopListeningAction,
  deckCardsReceived,
  deckCardsError,
} from '../actions/deck-cards';
import { USER_LOGOUT } from '../actions/shared';
import { convertToMap } from './common';
import { IState } from '../state';

export function createDeckCardsEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(DECK_CARDS_START_LISTENING)
    .mergeMap((action: IDeckCardsStartListeningAction) => databaseService.getDeckCards(action.uid, action.deckId)
        .map((deckCards: IDeckCard[]) => deckCardsReceived(action.uid, action.deckId, convertToMap(deckCards)))
        .takeUntil(action$
          .ofType(USER_LOGOUT, DECK_CARDS_STOP_LISTENING)
          .filter(stopAction => filterStopAction(stopAction, action.deckId))
        )
        .catch(err => Observable.of(deckCardsError(action.uid, action.deckId, err.message)))
    );
}

function filterStopAction(stopAction: Action, deckId: string): boolean {
  switch (stopAction.type) {
    case USER_LOGOUT:
      return true;

    case DECK_CARDS_STOP_LISTENING:
      return (stopAction as IDeckCardsStopListeningAction).deckId === deckId;
    
    default:
      return false;
  }
}