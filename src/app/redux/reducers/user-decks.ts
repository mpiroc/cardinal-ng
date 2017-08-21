import { Map, Set } from 'immutable';
import { Action } from 'redux';
import {
  USER_DECKS_START_LISTENING,
  USER_DECKS_RECEIVED,
  USER_DECKS_ERROR,
  IUserDecksAction,
  IUserDecksReceivedAction,
  IUserDecksErrorAction,
} from '../actions/user-decks';
import {
  USER_LOGOUT,
} from '../actions/shared';

const initialUserDecksState: Map<string, any> = Map({
  isListening: false,
  isLoading: false,
  error: false,
  deckIds: Set<string>(),
});

export function userDecks(state: Map<string, any> = initialUserDecksState, action: Action): Map<string, any> {
  switch (action.type) {
    case USER_DECKS_START_LISTENING:
      return state
        .set("isListening", true)
        .set("isLoading", true)
        .set("error", null);

    case USER_DECKS_RECEIVED:
    {
      const typedAction = action as IUserDecksReceivedAction;
      return state
        .set("isLoading", false)
        .set("deckIds", typedAction.deckIds);
    }

    case USER_DECKS_ERROR:
    {
      const typedAction = action as IUserDecksErrorAction;
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", typedAction.error);
    }

    case USER_LOGOUT:
    state.get
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", null)
        .set("deckIds", state.get("deckIds").clear());

    default:
      return state;
  }
}