import { Map } from 'immutable';
import { Action } from 'redux';
import { IUserDeck } from '../../models/firebase-models';
import {
  USER_DECKS_START_LISTENING,
  USER_DECKS_STOP_LISTENING,
  USER_DECKS_RECEIVED,
  USER_DECKS_ERROR,
  IUserDecksAction,
  IUserDecksReceivedAction,
  IUserDecksErrorAction,
} from '../actions/user-decks';
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

const initialUserDecksState = getInitialListState<IUserDeck>();

export function userDecks(state: Map<string, any> = initialUserDecksState, action: Action): Map<string, any> {
  switch (action.type) {
    case USER_DECKS_START_LISTENING:
      return onStartListening(state);

    case USER_DECKS_STOP_LISTENING:
      return onStopListening(state);

    case USER_DECKS_RECEIVED:
      return onListReceived(state, action as IUserDecksReceivedAction);

    case USER_DECKS_ERROR:
      return onError(state, action as IUserDecksErrorAction);

    case USER_LOGOUT:
      return state.clear();

    default:
      return state;
  }
}