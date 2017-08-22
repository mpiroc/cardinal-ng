import { Map } from 'immutable';
import { Action } from 'redux';
import {
  USER_START_LISTENING,
  USER_STOP_LISTENING,
  USER_RECEIVED,
  USER_ERROR,
  IUserReceivedAction,
  IUserErrorAction,
} from '../actions/user';

const initialUserState: Map<string, any> = Map({
  uid: null,
  displayName: null,
  isListening: false,
  isLoading: false,
  error: null,
});

export function user(state: Map<string, any> = initialUserState, action: Action) : Map<string, any> {
  switch (action.type) {
    case USER_START_LISTENING:
      return state
        .set("isListening", true)
        .set("isLoading", true)
        .set("error", null);

    case USER_STOP_LISTENING:
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", null);

    case USER_RECEIVED:
    {
      const typedAction = action as IUserReceivedAction;
      return state
        .set("isLoading", false)
        .set("error", null)
        .set("uid", typedAction.uid)
        .set("displayName", typedAction.displayName);
    }

    case USER_ERROR:
    {
      const typedAction = action as IUserErrorAction;
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", typedAction.error);
    }

    default:
      return state;
  }
}