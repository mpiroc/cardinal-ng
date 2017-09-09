import { Map } from 'immutable';
import { Action } from 'redux';

import {
  SIGN_UP_SET_EMAIL,
  SIGN_UP_SET_PASSWORD,
  SIGN_UP_SUBMIT,
  SIGN_UP_SUBMIT_SUCCESS,
  SIGN_UP_SUBMIT_ERROR,
  ISignUpSetEmailAction,
  ISignUpSetPasswordAction,
  ISignUpSubmitErrorAction,
} from '../actions/sign-up';


const initialState = Map<string, any>({
  email: null,
  password: null,
  isSubmitting: false,
  error: null,
})

export function signUp(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case SIGN_UP_SET_EMAIL:
      return state.set('email', (action as ISignUpSetEmailAction).email);

    case SIGN_UP_SET_PASSWORD:
      return state.set('password', (action as ISignUpSetPasswordAction).password);

    case SIGN_UP_SUBMIT:
      return state.set('isSubmitting', true);

    case SIGN_UP_SUBMIT_SUCCESS:
      return state.set('isSubmitting', false);

    case SIGN_UP_SUBMIT_ERROR:
      return state
        .set('isSubmitting', false)
        .set('error', (action as ISignUpSubmitErrorAction).error);

    default:
      return state;
  }
}
