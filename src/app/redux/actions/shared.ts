import { Action } from 'redux';

export const USER_LOGOUT = "USER_LOGOUT";

export interface IUserLogoutAction extends Action {

}

export function userLogout() : IUserLogoutAction {
  return {
    type: USER_LOGOUT,
  }
}