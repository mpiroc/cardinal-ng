import { Action } from 'redux'

export const SIGN_UP_SET_EMAIL = 'SIGN_UP_SET_EMAIL'
export const SIGN_UP_SET_PASSWORD = 'SIGN_UP_SET_PASSWORD'
export const SIGN_UP_SUBMIT = 'SIGN_UP_SUBMIT'
export const SIGN_UP_SUBMIT_SUCCESS = 'SIGN_UP_SUBMIT_SUCCESS'
export const SIGN_UP_SUBMIT_USER_ERROR = 'SIGN_UP_SUBMIT_USER_ERROR'
export const SIGN_UP_SUBMIT_PASSWORD_ERROR = 'SIGN_UP_SUBMIT_PASSWORD_ERROR'
export const SIGN_UP_SUBMIT_PROVIDER_ERROR = 'SIGN_UP_SUBMIT_PROVIDER_ERROR'

export interface ISignUpSetEmailAction extends Action {
  email: string
}

export interface ISignUpSetPasswordAction extends Action {
  password: string
}

export interface ISignUpSubmitErrorAction extends Action {
  error: string,
}

export function signUpSetEmail(email: string): ISignUpSetEmailAction {
  return {
    type: SIGN_UP_SET_EMAIL,
    email,
  }
}

export function signUpSetPassword(password: string): ISignUpSetPasswordAction {
  return {
    type: SIGN_UP_SET_PASSWORD,
    password,
  }
}

export function signUpSubmit(): Action {
  return {
    type: SIGN_UP_SUBMIT,
  }
}

export function signUpSubmitSuccess(): Action {
  return {
    type: SIGN_UP_SUBMIT_SUCCESS,
  }
}

export function signUpSubmitUserError(error: string): ISignUpSubmitErrorAction {
  return {
    type: SIGN_UP_SUBMIT_USER_ERROR,
    error,
  }
}

export function signUpSubmitPasswordError(error: string): ISignUpSubmitErrorAction {
  return {
    type: SIGN_UP_SUBMIT_PASSWORD_ERROR,
    error,
  }
}

export function signUpSubmitProviderError(error: string): ISignUpSubmitErrorAction {
  return {
    type: SIGN_UP_SUBMIT_PROVIDER_ERROR,
    error,
  }
}
