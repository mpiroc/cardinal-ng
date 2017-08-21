import { Map } from 'immutable';
import { Action } from 'redux';
import {
  DECK_CARDS_START_LISTENING,
  DECK_CARDS_STOP_LISTENING,
  DECK_CARDS_RECEIVED,
  DECK_CARDS_ERROR,
  IDeckCardsAction,
  IDeckCardsStartListeningAction,
  IDeckCardsStopListeningAction,
  IDeckCardsReceivedAction,
  IDeckCardsErrorAction,
} from '../actions/deck-cards';
import {
  USER_LOGOUT,
} from '../actions/shared';
import { IDeckCard } from '../../models/firebase-models';

const initialSingleDeckCardsState: Map<string, any> = Map({
  isListening: false,
  isLoading: false,
  error: false,
  cards: Map<string, IDeckCard>(),
})

export function singleDeckCards(state: Map<string, any> = initialSingleDeckCardsState, action: Action): Map<string, any> {
  switch (action.type) {
    case DECK_CARDS_START_LISTENING:
      return state
        .set("isListening", true)
        .set("isLoading", true)
        .set("error", null);
    
    case DECK_CARDS_STOP_LISTENING:
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", null);
    
    case DECK_CARDS_RECEIVED:
    {
      const typedAction = action as IDeckCardsReceivedAction;
      return state
        .set("isLoading", false)
        .set("cards", typedAction.cards);
    }
    
    case DECK_CARDS_ERROR:
    {
      const typedAction = action as IDeckCardsErrorAction;
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", typedAction.error);
    }

    default:
      return state;
  }
}

const initialDeckCardsState: Map<string, any> = Map({});

export function deckCards(state: Map<string, any> = initialDeckCardsState, action: Action): Map<string, any> {
  switch(action.type) {
    case DECK_CARDS_START_LISTENING:
    case DECK_CARDS_STOP_LISTENING:
    case DECK_CARDS_RECEIVED:
    case DECK_CARDS_ERROR:
    {
      const typedAction = action as IDeckCardsAction;
      
      return state.set(
        typedAction.deckId,
        singleDeckCards(state.get(typedAction.deckId), action));
    }

    case USER_LOGOUT:
      return state.clear();

    default:
      return state;
  }
}