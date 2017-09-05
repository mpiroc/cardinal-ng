import { Action } from 'redux';

export const SIGN_IN_SET_EMAIL = "SIGN_IN_SET_EMAIL";
export const SIGN_IN_SET_PASSWORD = "SIGN_IN_SET_PASSWORD";
export const SIGN_IN_SET_REMEMBER_ME = "SIGN_IN_SET_REMEMBER_ME";
export const SIGN_IN_CLEAR = "SIGN_IN_CLEAR";

export interface ISignInSetEmailAction extends Action {
  email: string;
}

export interface ISignInSetPasswordAction extends Action {
  password: string;
}

export interface ISignInSetRememberMeAction extends Action {
  rememberMe: boolean;
}

export interface ISignInCleanAction extends Action {
}

export function signInSetEmail(email: string) {
  return {
    type: SIGN_IN_SET_EMAIL,
    email,
  };
}

export function signInSetPassword(password: string) {
  return {
    type: SIGN_IN_SET_PASSWORD,
    password,
  };
}

export function signInSetRememberMe(rememberMe: boolean) {
  return {
    type: SIGN_IN_SET_REMEMBER_ME,
    rememberMe,
  };
}

export function signInClear() {
  return {
    type: SIGN_IN_CLEAR,
  };
}