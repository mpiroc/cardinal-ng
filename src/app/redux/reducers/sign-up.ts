import { Map } from 'immutable';
import { Action } from 'redux';

import {
  SIGN_UP_SET_EMAIL,
  SIGN_UP_SET_PASSWORD,
  SIGN_UP_SUBMIT,
  SIGN_UP_SUBMIT_SUCCESS,
  SIGN_UP_SUBMIT_USER_ERROR,
  SIGN_UP_SUBMIT_PASSWORD_ERROR,
  SIGN_UP_SUBMIT_OTHER_ERROR,
  ISignUpSetEmailAction,
  ISignUpSetPasswordAction,
  ISignUpSubmitErrorAction,
} from '../actions/sign-up';


const initialState = Map<string, any>({
  email: null,
  password: null,
  isSubmitting: false,
  userError: null,
  passwordError: null,
  otherError: null,
})

export function signUp(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case SIGN_UP_SET_EMAIL:
      return state.set('email', (action as ISignUpSetEmailAction).email);

    case SIGN_UP_SET_PASSWORD:
      return state.set('password', (action as ISignUpSetPasswordAction).password);

    case SIGN_UP_SUBMIT:
      return state
        .set('isSubmitting', true)
        .set('userError', null)
        .set('passwordError', null)
        .set('otherError', null);

    case SIGN_UP_SUBMIT_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('userError', null)
        .set('passwordError', null)
        .set('otherError', null);

    case SIGN_UP_SUBMIT_USER_ERROR:
      return state
        .set('isSubmitting', false)
        .set('userError', (action as ISignUpSubmitErrorAction).error)
        .set('passwordError', null)
        .set('otherError', null);

    case SIGN_UP_SUBMIT_PASSWORD_ERROR:
      return state
        .set('isSubmitting', false)
        .set('userError', null)
        .set('passwordError', (action as ISignUpSubmitErrorAction).error)
        .set('otherError', null);

    case SIGN_UP_SUBMIT_OTHER_ERROR:
      return state
        .set('isSubmitting', false)
        .set('userError', null)
        .set('passwordError', null)
        .set('otherError', (action as ISignUpSubmitErrorAction).error);

    default:
      return state;
  }
}
