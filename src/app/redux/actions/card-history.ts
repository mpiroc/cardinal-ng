import { Action } from 'redux';
import { ICardHistory } from '../../models/firebase-models';
import {
  IReceivedAction,
  IErrorAction,
} from './common';

// Actions
export const CARD_HISTORY_START_LISTENING = "CARD_HISTORY_START_LISTENING";
export const CARD_HISTORY_STOP_LISTENING = "CARD_HISTORY_STOP_LISTENING";
export const CARD_HISTORY_RECEIVED = "CARD_HISTORY_RECEIVED";
export const CARD_HISTORY_ERROR = "CARD_HISTORY_ERROR";

// Action types
export interface ICardHistoryAction extends Action {
  uid: string;
  deckId: string;
  cardId: string;
}

export interface ICardHistoryStartListeningAction extends ICardHistoryAction {
}

export interface ICardHistoryStopListeningAction extends ICardHistoryAction {
}

export interface ICardHistoryReceivedAction extends ICardHistoryAction, IReceivedAction<ICardHistory> {
}

export interface ICardHistoryErrorAction extends ICardHistoryAction, IErrorAction {
}

// Action creators
export function cardHistoryStartListening(uid: string, deckId: string, cardId: string) : ICardHistoryStartListeningAction {
  return {
    type: CARD_HISTORY_START_LISTENING,
    uid,
    deckId,
    cardId,
  };
}

export function cardHistoryStopListening(uid: string, deckId: string, cardId: string) : ICardHistoryStopListeningAction {
  return {
    type: CARD_HISTORY_STOP_LISTENING,
    uid,
    deckId,
    cardId,
  };
}

export function cardHistoryReceived(uid: string, deckId: string, cardId: string, data: ICardHistory) : ICardHistoryReceivedAction {
  return {
    type: CARD_HISTORY_RECEIVED,
    uid,
    deckId,
    cardId,
    data,
  };
}

export function cardHistoryError(uid: string, deckId: string, cardId: string, error: string) : ICardHistoryErrorAction {
  return {
    type: CARD_HISTORY_ERROR,
    uid,
    deckId,
    cardId,
    error,
  };
}