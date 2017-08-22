import { Action } from 'redux';
import { IDeckInfo } from '../../models/firebase-models';
import {
  IReceivedAction,
  IErrorAction,
} from './common';

// Actions
export const DECK_INFO_START_LISTENING = "DECK_INFO_START_LISTENING";
export const DECK_INFO_STOP_LISTENING = "DECK_INFO_STOP_LISTENING";
export const DECK_INFO_RECEIVED = "DECK_INFO_RECIEVED";
export const DECK_INFO_ERROR = "DECK_INFO_ERROR";

// Action types
export interface IDeckInfoAction extends Action {
  uid: string;
  deckId: string;
}

export interface IDeckInfoStartListeningAction extends IDeckInfoAction {
}

export interface IDeckInfoStopListeningAction extends IDeckInfoAction {
}

export interface IDeckInfoReceivedAction extends IDeckInfoAction, IReceivedAction<IDeckInfo> {
}

export interface IDeckInfoErrorAction extends IDeckInfoAction, IErrorAction {
}

// Action creators
export function deckInfoStartListening(uid: string, deckId: string) : IDeckInfoStartListeningAction {
  return {
    type: DECK_INFO_START_LISTENING,
    uid,
    deckId,
  };
}

export function deckInfoStopListening(uid: string, deckId: string) : IDeckInfoStopListeningAction {
  return {
    type: DECK_INFO_STOP_LISTENING,
    uid,
    deckId,
  }
}

export function deckInfoReceived(uid: string, deckId: string, data: IDeckInfo) : IDeckInfoReceivedAction {
  return {
    type: DECK_INFO_RECEIVED,
    uid,
    deckId,
    data,
  };
}

export function deckInfoError(uid: string, deckId: string, error: string) : IDeckInfoErrorAction {
  return {
    type: DECK_INFO_ERROR,
    uid,
    deckId,
    error,
  };
}