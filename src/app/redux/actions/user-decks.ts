import { Action } from 'redux';
import { Set } from 'immutable';

// Actions
export const USER_DECKS_START_LISTENING = "USER_DECKS_START_LISTENING";
export const USER_DECKS_RECEIVED = "USER_DECKS_RECEIVED";
export const USER_DECKS_ERROR = "USER_DECKS_ERROR";

// Action types
export interface IUserDecksAction extends Action {
  uid: string;
}

export interface IUserDecksStartListeningAction extends IUserDecksAction {
}

export interface IUserDecksReceivedAction extends IUserDecksAction {
  deckIds: Set<string>;
}

export interface IUserDecksErrorAction extends IUserDecksAction {
  error: string;
}

// Action creators
export function userDecksStartListening(uid: string) : IUserDecksStartListeningAction {
  return {
    type: USER_DECKS_START_LISTENING,
    uid,
  }
}

export function userDecksReceived(uid: string, deckIds: Set<string>) : IUserDecksReceivedAction {
  return {
    type: USER_DECKS_RECEIVED,
    uid,
    deckIds,
  }
}

export function userDecksError(uid: string, error: string) : IUserDecksErrorAction {
  return {
    type: USER_DECKS_ERROR,
    uid,
    error,
  }
}