import { Action } from 'redux';

export const SIGN_IN_SET_EMAIL = 'SIGN_IN_SET_EMAIL';
export const SIGN_IN_SET_PASSWORD = 'SIGN_IN_SET_PASSWORD';
export const SIGN_IN_SET_REMEMBER_ME = 'SIGN_IN_SET_REMEMBER_ME';
export const SIGN_IN_SUBMIT = 'SIGN_IN_SUBMIT';
export const SIGN_IN_SUBMIT_SUCCESS = 'SIGN_IN_SUBMIT_SUCCESS';
export const SIGN_IN_SUBMIT_USER_ERROR = 'SIGN_IN_SUBMIT_USER_ERROR';
export const SIGN_IN_SUBMIT_PASSWORD_ERROR = 'SIGN_IN_SUBMIT_PASSWORD_ERROR';

export interface ISignInSetEmailAction extends Action {
  email: string;
}

export interface ISignInSetPasswordAction extends Action {
  password: string;
}

export interface ISignInSetRememberMeAction extends Action {
  rememberMe: boolean;
}

export interface ISignInSubmitErrorAction extends Action {
  error: string;
}

export function signInSetEmail(email: string): ISignInSetEmailAction {
  return {
    type: SIGN_IN_SET_EMAIL,
    email,
  };
}

export function signInSetPassword(password: string): ISignInSetPasswordAction {
  return {
    type: SIGN_IN_SET_PASSWORD,
    password,
  };
}

export function signInSetRememberMe(rememberMe: boolean): ISignInSetRememberMeAction {
  return {
    type: SIGN_IN_SET_REMEMBER_ME,
    rememberMe,
  };
}

export function signInSubmit(): Action {
  return {
    type: SIGN_IN_SUBMIT,
  }
}

export function signInSubmitSuccess(): Action {
  return {
    type: SIGN_IN_SUBMIT_SUCCESS,
  }
}

export function signInSubmitUserError(error: string): ISignInSubmitErrorAction {
  return {
    type: SIGN_IN_SUBMIT_USER_ERROR,
    error,
  }
}

export function signInSubmitPasswordError(error: string): ISignInSubmitErrorAction {
  return {
    type: SIGN_IN_SUBMIT_PASSWORD_ERROR,
    error,
  }
}
