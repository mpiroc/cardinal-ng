import { Map } from 'immutable';
import { Action } from 'redux';
import {
  DECK_INFO_START_LISTENING,
  DECK_INFO_STOP_LISTENING,
  DECK_INFO_RECEIVED,
  DECK_INFO_ERROR,
  IDeckInfoAction,
  IDeckInfoReceivedAction,
  IDeckInfoErrorAction,
} from '../actions/deck-info';
import {
  USER_LOGOUT,
} from '../actions/shared';
import {
  onStartListening,
  onStopListening,
  onItemReceived,
  onError,
} from './common';

const initialDeckInfoState: Map<string, any> = Map({
  isListening: false,
  isLoading: false,
  error: null,
  data: null,
});

export function deckInfo(state: Map<string, any> = initialDeckInfoState, action: Action) : Map<string, any> {
  switch (action.type) {
    case DECK_INFO_START_LISTENING:
      return onStartListening(state);

    case DECK_INFO_STOP_LISTENING:
      return onStopListening(state);

    case DECK_INFO_RECEIVED:
      return onItemReceived(state, action as IDeckInfoReceivedAction);

    case DECK_INFO_ERROR:
      return onError(state, action as IDeckInfoErrorAction);

    default:
      return state;
  }
}

const initialDeckInfosState = Map<string, any>({
})

export function deckInfos(state: Map<string, any> = initialDeckInfosState, action: Action) {
  switch (action.type) {
    case DECK_INFO_START_LISTENING:
    case DECK_INFO_STOP_LISTENING:
    case DECK_INFO_RECEIVED:
    case DECK_INFO_ERROR:
      const typedAction = action as IDeckInfoAction;
      return state.set(
        typedAction.deckId,
        deckInfo(state.get(typedAction.deckId),action),
      );
    
    case USER_LOGOUT:
      return state.clear();

    default:
      return state;
  }
}