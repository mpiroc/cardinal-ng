import { Action } from 'redux';

export const USER_START_LISTENING = "USER_START_LISTENING";
export const USER_STOP_LISTENING = "USER_STOP_LISTENING";
export const USER_RECEIVED = "USER_RECEIVED";
export const USER_ERROR = "USER_ERROR";

export interface IUserStartListeningAction extends Action {
}

export interface IUserStopListeningAction extends Action {
}

export interface IUserReceivedAction extends Action {
  uid: string,
  displayName: string;
}

export interface IUserErrorAction extends Action {
  error: string;
}

export function userStartListening() : IUserStartListeningAction {
  return {
    type: USER_START_LISTENING,
  };
}

export function userStopListening() : IUserStopListeningAction {
  return {
    type: USER_STOP_LISTENING,
  };
}

export function userReceived(uid: string, displayName: string) : IUserReceivedAction {
  return {
    type: USER_RECEIVED,
    uid,
    displayName,
  }
}

export function userError(error: string) : IUserErrorAction {
  return {
    type: USER_ERROR,
    error,
  }
}