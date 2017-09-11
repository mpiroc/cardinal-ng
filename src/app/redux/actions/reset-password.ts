import { Action } from 'redux';

export const RESET_PASSWORD_SET_EMAIL = 'RESET_PASSWORD_SET_EMAIL';

export interface IResetPasswordSetEmailAction extends Action {
  email: string;
}

export function resetPasswordSetEmail(email: string): IResetPasswordSetEmailAction {
  return {
    type: RESET_PASSWORD_SET_EMAIL,
    email,
  };
}
