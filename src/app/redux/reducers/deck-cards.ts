import { Map } from 'immutable';
import { Action } from 'redux';
import { IDeckCard } from '../../models/firebase-models';
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
import {
  getInitialListState,
  onStartListening,
  onStopListening,
  onListReceived,
  onError,
} from './common';

const initialSingleDeckCardsState = getInitialListState<IDeckCard>();

export function singleDeckCards(state: Map<string, any> = initialSingleDeckCardsState, action: Action): Map<string, any> {
  switch (action.type) {
    case DECK_CARDS_START_LISTENING:
      return onStartListening(state);

    case DECK_CARDS_STOP_LISTENING:
      return onStopListening(state);
    
    case DECK_CARDS_RECEIVED:
      return onListReceived(state, action as IDeckCardsReceivedAction);
    
    case DECK_CARDS_ERROR:
      return onError(state, action as IDeckCardsErrorAction);

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