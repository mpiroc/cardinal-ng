import { Map } from 'immutable';
import { Action } from 'redux';

import {
  SIGN_UP_SET_EMAIL,
  SIGN_UP_SET_PASSWORD,
  SIGN_UP_CLEAR,
  ISignUpSetEmailAction,
  ISignUpSetPasswordAction,
} from '../actions/sign-up';

const initialState = Map<string, any>({
  email: null,
  password: null,
  rememberMe: false,
})

export function signUp(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case SIGN_UP_SET_EMAIL:
      return state.set('email', (action as ISignUpSetEmailAction).email);

    case SIGN_UP_SET_PASSWORD:
      return state.set('password', (action as ISignUpSetPasswordAction).password);

    case SIGN_UP_CLEAR:
      return state
        .set('email', null)
        .set('password', null);

    default:
      return state;
  }
}
