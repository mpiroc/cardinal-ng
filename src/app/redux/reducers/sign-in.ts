import { Map } from 'immutable';
import { Action } from 'redux';

import {
  SIGN_IN_SET_EMAIL,
  SIGN_IN_SET_PASSWORD,
  SIGN_IN_SET_REMEMBER_ME,
  SIGN_IN_SUBMIT,
  SIGN_IN_SUBMIT_SUCCESS,
  SIGN_IN_SUBMIT_USER_ERROR,
  SIGN_IN_SUBMIT_PASSWORD_ERROR,
  ISignInSetEmailAction,
  ISignInSetPasswordAction,
  ISignInSetRememberMeAction,
  ISignInSubmitErrorAction,
} from '../actions/sign-in';

const initialState = Map<string, any>({
  email: null,
  password: null,
  rememberMe: false,
  isSubmitting: false,
  userError: null,
  passwordError: null,
})

export function signIn(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case SIGN_IN_SET_EMAIL:
      return state.set('email', (action as ISignInSetEmailAction).email);

    case SIGN_IN_SET_PASSWORD:
      return state.set('password', (action as ISignInSetPasswordAction).password);

    case SIGN_IN_SET_REMEMBER_ME:
      return state.set('rememberMe', (action as ISignInSetRememberMeAction).rememberMe);

    case SIGN_IN_SUBMIT:
      return state
        .set('isSubmitting', true)
        .set('userError', null)
        .set('passwordError', null)

    case SIGN_IN_SUBMIT_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('userError', null)
        .set('passwordError', null)

    case SIGN_IN_SUBMIT_USER_ERROR:
      return state
        .set('isSubmitting', false)
        .set('userError', (action as ISignInSubmitErrorAction).error)
        .set('passwordError', null)

    case SIGN_IN_SUBMIT_PASSWORD_ERROR:
      return state
        .set('isSubmitting', false)
        .set('userError', null)
        .set('passwordError', (action as ISignInSubmitErrorAction).error)

    default:
      return state;
  }
}
