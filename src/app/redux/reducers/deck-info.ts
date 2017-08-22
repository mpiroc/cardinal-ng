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

const initialDeckInfoState: Map<string, any> = Map({
  name: null,
  description: null,
  isListening: false,
  isLoading: false,
  error: null,
});

export function deckInfo(state: Map<string, any> = initialDeckInfoState, action: Action) : Map<string, any> {
  switch (action.type) {
    case DECK_INFO_START_LISTENING:
      return state
        .set("isListening", true)
        .set("isLoading", true)
        .set("error", null);

    case DECK_INFO_STOP_LISTENING:
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", null);

    case DECK_INFO_RECEIVED:
    {
      const typedAction = action as IDeckInfoReceivedAction;
      return state
        .set("isLoading", false)
        .set("name", typedAction.name)
        .set("description", typedAction.description);
    }

    case DECK_INFO_ERROR:
    {
      const typedAction = action as IDeckInfoErrorAction;
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", typedAction.error);
    }

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
      return state.set(typedAction.deckId, deckInfo(
        state.get(typedAction.deckId),
        action));
    
    case USER_LOGOUT:
      return state.clear();

    default:
      return state;
  }
}