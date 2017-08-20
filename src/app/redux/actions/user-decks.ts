import { Action } from 'redux';

// Actions
export const USER_DECKS_START_LISTENING = "USER_DECKS_START_LISTENING";
export const USER_DECKS_STOP_LISTENING = "USER_DECKS_STOP_LISTENING";
export const USER_DECKS_RECEIVED = "USER_DECKS_RECEIVED";
export const USER_DECKS_ERROR = "USER_DECKS_ERROR";

// Action types
export interface IUserDecksAction extends Action {
  uid: string;
}

export interface IUserDecksStartListeningAction extends IUserDecksAction {
}

export interface IUserDecksStopListeningAction extends IUserDecksAction {
}

export interface IUserDecksReceivedAction extends IUserDecksAction {
  deckIds: string[];
}

export interface IUserDecksErrorAction extends IUserDecksAction {
  error: string;
}

// Action creators
export function userDecksStartListening(uid: string) {
  return {
    type: USER_DECKS_START_LISTENING,
    uid,
  }
}

export function userDecksStopListening(uid: string) {
  return {
    type: USER_DECKS_STOP_LISTENING,
    uid,
  }
}

export function userDecksReceived(uid: string, deckIds: string[]) {
  return {
    type: USER_DECKS_RECEIVED,
    uid,
    deckIds,
  }
}

export function userDecksError(uid: string, error: string) {
  return {
    type: USER_DECKS_ERROR,
    uid,
    error,
  }
}