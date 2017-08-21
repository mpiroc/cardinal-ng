import { Action } from 'redux';
import { Map } from 'immutable';
import { IDeckCard } from '../../models/firebase-models';

// Actions
export const DECK_CARDS_START_LISTENING = "DECK_CARDS_START_LISTENING";
export const DECK_CARDS_STOP_LISTENING = "DECK_CARDS_STOP_LISTENING";
export const DECK_CARDS_RECEIVED = "DECK_CARDS_RECEIVED";
export const DECK_CARDS_ERROR = "DECK_CARDS_ERROR";

// Action type
export interface IDeckCardsAction extends Action {
  uid: string;
  deckId: string;
}

export interface IDeckCardsStartListeningAction extends IDeckCardsAction {

}

export interface IDeckCardsStopListeningAction extends IDeckCardsAction {

}

export interface IDeckCardsReceivedAction extends IDeckCardsAction {
  cards: Map<string, IDeckCard>;
}

export interface IDeckCardsErrorAction extends IDeckCardsAction {
  error: string;
}

// Action creators
export function deckCardsStartListening(uid: string, deckId: string) : IDeckCardsStartListeningAction {
  return {
    type: DECK_CARDS_START_LISTENING,
    uid,
    deckId,
  };
}

export function deckCardsStopListening(uid: string, deckId: string) : IDeckCardsStopListeningAction {
  return {
    type: DECK_CARDS_STOP_LISTENING,
    uid,
    deckId,
  };
}

export function deckCardsReceived(uid: string, deckId: string, cards: Map<string, IDeckCard>) : IDeckCardsReceivedAction {
  return {
    type: DECK_CARDS_RECEIVED,
    uid,
    deckId,
    cards,
  };
}

export function deckCardsError(uid: string, deckId: string, error: string) : IDeckCardsErrorAction {
  return {
    type: DECK_CARDS_ERROR,
    uid,
    deckId,
    error,
  };
}