import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { DatabaseService } from '../../services/database.service';
import { ICardHistory, IDeckCard } from '../../models/firebase-models';
import {
  CARD_HISTORY_START_LISTENING,
  CARD_HISTORY_STOP_LISTENING,
  ICardHistoryAction,
  ICardHistoryStartListeningAction,
  ICardHistoryStopListeningAction,
  cardHistoryStopListening,
  cardHistoryReceived,
  cardHistoryError,
} from '../actions/card-history';
import {
  DECK_CARDS_RECEIVED,
  IDeckCardsReceivedAction,
} from '../actions/deck-cards';
import {
  USER_LOGOUT,
} from '../actions/shared';
import { IState } from '../state';

export function createCardHistoryEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(CARD_HISTORY_START_LISTENING)
    .mergeMap((action: ICardHistoryStartListeningAction) => databaseService.getCardHistory(action.uid, action.deckId, action.cardId)
      .map((cardHistory: ICardHistory) => cardHistoryReceived(action.uid, action.deckId, action.cardId, cardHistory))
      .takeUntil(action$
        .ofType(USER_LOGOUT, CARD_HISTORY_STOP_LISTENING)
        .filter(stopAction => filterStopAction(stopAction, action.cardId))
      )
      .catch(err => Observable.of(cardHistoryError(action.uid, action.deckId, action.cardId, err.message)))
    );
}

export function createCardHistoryCleanupEpic() {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(DECK_CARDS_RECEIVED)
    .mergeMap((action: IDeckCardsReceivedAction) => store.getState().deckCards.get(action.deckId).get("data")
      .filterNot((deckCard: IDeckCard) => action.data.has(deckCard.$key))
      .map(cardId => cardHistoryStopListening(action.uid, action.deckId, cardId))
      .toArray()
    );
}

function filterStopAction(stopAction: Action, cardId: string): boolean {
  switch (stopAction.type) {
    case USER_LOGOUT:
      return true;

    case CARD_HISTORY_STOP_LISTENING:
      const typedStopAction = stopAction as ICardHistoryStopListeningAction;
      return typedStopAction.cardId == cardId;

    default:
      return false;
  }
}