import { Map } from 'immutable';
import { Action } from 'redux';

import {
  SIGN_IN_SET_EMAIL,
  SIGN_IN_SET_PASSWORD,
  SIGN_IN_SET_REMEMBER_ME,
  SIGN_IN_CLEAR,
  ISignInSetEmailAction,
  ISignInSetPasswordAction,
  ISignInSetRememberMeAction,
} from '../actions/sign-in';

const initialState = Map<string, any>({
  email: null,
  password: null,
  rememberMe: false,
})

export function signIn(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case SIGN_IN_SET_EMAIL:
      return state.set('email', (action as ISignInSetEmailAction).email);

    case SIGN_IN_SET_PASSWORD:
      return state.set('password', (action as ISignInSetPasswordAction).password);

    case SIGN_IN_SET_REMEMBER_ME:
      return state.set('rememberMe', (action as ISignInSetRememberMeAction).rememberMe);

    case SIGN_IN_CLEAR:
      return state
        .set('email', null)
        .set('password', null)
        .set('rememberMe', false);

    default:
      return state;
  }
}
