import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { DatabaseService } from '../../services/database.service';
import { ICardContent, IDeckCard } from '../../models/firebase-models';
import {
  CARD_CONTENT_START_LISTENING,
  CARD_CONTENT_STOP_LISTENING,
  ICardContentAction,
  ICardContentStartListeningAction,
  ICardContentStopListeningAction,
  cardContentStopListening,
  cardContentReceived,
  cardContentError,
} from '../actions/card-content';
import {
  DECK_CARDS_RECEIVED,
  IDeckCardsReceivedAction,
} from '../actions/deck-cards';
import {
  USER_LOGOUT,
} from '../actions/shared';
import { IState } from '../state';

export function createCardContentEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(CARD_CONTENT_START_LISTENING)
    .mergeMap((action: ICardContentStartListeningAction) => databaseService.getCardContent(action.uid, action.deckId, action.cardId)
      .map((cardContent: ICardContent) => cardContentReceived(action.uid, action.deckId, action.cardId, cardContent))
      .takeUntil(action$
        .ofType(USER_LOGOUT, CARD_CONTENT_STOP_LISTENING)
        .filter(stopAction => filterStopAction(stopAction, action.cardId))
      )
      .catch(err => Observable.of(cardContentError(action.uid, action.deckId, action.cardId, err.message)))
    );
}

export function createCardContentCleanupEpic() {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(DECK_CARDS_RECEIVED)
    .mergeMap((action: IDeckCardsReceivedAction) => store.getState().deckCards.get("cards")
      .filterNot((deckCard: IDeckCard) => action.cards.has(deckCard.$key))
      .map(cardId => cardContentStopListening(action.uid, action.deckId, cardId))
      .toArray()
    );
}

function filterStopAction(stopAction: Action, cardId: string): boolean {
  switch (stopAction.type) {
    case USER_LOGOUT:
      return true;

    case CARD_CONTENT_STOP_LISTENING:
      const typedStopAction = stopAction as ICardContentStopListeningAction;
      return typedStopAction.cardId == cardId;

    default:
      return false;
  }
}