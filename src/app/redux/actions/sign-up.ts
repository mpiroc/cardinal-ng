import { Action } from 'redux';

export const SIGN_UP_SET_EMAIL = 'SIGN_UP_SET_EMAIL';
export const SIGN_UP_SET_PASSWORD = 'SIGN_UP_SET_PASSWORD';
export const SIGN_UP_CLEAR = 'SIGN_UP_CLEAR';

export interface ISignUpSetEmailAction extends Action {
  email: string;
}

export interface ISignUpSetPasswordAction extends Action {
  password: string;
}

export function signUpSetEmail(email: string): ISignUpSetEmailAction {
  return {
    type: SIGN_UP_SET_EMAIL,
    email,
  };
}

export function signUpSetPassword(password: string): ISignUpSetPasswordAction {
  return {
    type: SIGN_UP_SET_PASSWORD,
    password,
  };
}

export function signUpClear(): Action {
  return {
    type: SIGN_UP_CLEAR,
  };
}
