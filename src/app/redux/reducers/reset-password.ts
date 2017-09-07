import { Map } from 'immutable';
import { Action } from 'redux';

import {
  RESET_PASSWORD_SET_EMAIL,
  RESET_PASSWORD_CLEAR,
  IResetPasswordSetEmailAction,
} from '../actions/reset-password';

const initialState = Map<string, any>({
  email: null,
})

export function resetPassword(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case RESET_PASSWORD_SET_EMAIL:
      return state.set('email', (action as IResetPasswordSetEmailAction).email);

    case RESET_PASSWORD_CLEAR:
      return state.set('email', null)

    default:
      return state;
  }
}
