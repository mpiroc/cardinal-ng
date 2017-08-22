import { Action } from 'redux';
import { ICardContent } from '../../models/firebase-models';
import {
  IReceivedAction,
  IErrorAction,
} from './common';

// Actions
export const CARD_CONTENT_START_LISTENING = "CARD_CONTENT_START_LISTENING";
export const CARD_CONTENT_STOP_LISTENING = "CARD_CONTENT_STOP_LISTENING";
export const CARD_CONTENT_RECEIVED = "CARD_CONTENT_RECEIVED";
export const CARD_CONTENT_ERROR = "CARD_CONTENT_ERROR";

// Action types
export interface ICardContentAction extends Action {
  uid: string;
  deckId: string;
  cardId: string;
}

export interface ICardContentStartListeningAction extends ICardContentAction {
}

export interface ICardContentStopListeningAction extends ICardContentAction {
}

export interface ICardContentReceivedAction extends ICardContentAction, IReceivedAction<ICardContent> {
}

export interface ICardContentErrorAction extends ICardContentAction, IErrorAction {
}

// Action creators
export function cardContentStartListening(uid: string, deckId: string, cardId: string) : ICardContentStartListeningAction {
  return {
    type: CARD_CONTENT_START_LISTENING,
    uid,
    deckId,
    cardId,
  };
}

export function cardContentStopListening(uid: string, deckId: string, cardId: string) : ICardContentStopListeningAction {
  return {
    type: CARD_CONTENT_STOP_LISTENING,
    uid,
    deckId,
    cardId,
  };
}

export function cardContentReceived(uid: string, deckId: string, cardId: string, data: ICardContent) : ICardContentReceivedAction {
  return {
    type: CARD_CONTENT_RECEIVED,
    uid,
    deckId,
    cardId,
    data,
  };
}

export function cardContentError(uid: string, deckId: string, cardId: string, error: string) : ICardContentErrorAction {
  return {
    type: CARD_CONTENT_ERROR,
    uid,
    deckId,
    cardId,
    error,
  };
}

