import { Map } from 'immutable';
import { Action } from 'redux';
import { ICardContent } from '../../models/firebase-models';
import {
  CARD_CONTENT_START_LISTENING,
  CARD_CONTENT_STOP_LISTENING,
  CARD_CONTENT_RECEIVED,
  CARD_CONTENT_ERROR,
  ICardContentAction,
  ICardContentReceivedAction,
  ICardContentErrorAction,
} from '../actions/card-content';
import {
  USER_LOGOUT,
} from '../actions/shared';
import {
  getInitialItemState,
  onStartListening,
  onStopListening,
  onItemReceived,
  onError,
} from './common';

const initialCardContentState = getInitialItemState();

export function cardContent(state: Map<string, any> = initialCardContentState, action: Action) : Map<string, any> {
  switch (action.type) {
    case CARD_CONTENT_START_LISTENING:
      return onStartListening(state);

    case CARD_CONTENT_STOP_LISTENING:
      return onStopListening(state);

    case CARD_CONTENT_RECEIVED:
      return onItemReceived(state, action as ICardContentReceivedAction);

    case CARD_CONTENT_ERROR:
      return onError(state, action as ICardContentErrorAction);

    default:
      return state;
  }
}

const initialCardContentsState = Map<string, any>();

export function cardContents(state: Map<string, any> = initialCardContentsState, action: Action) {
  switch (action.type) {
    case CARD_CONTENT_START_LISTENING:
    case CARD_CONTENT_STOP_LISTENING:
    case CARD_CONTENT_RECEIVED:
    case CARD_CONTENT_ERROR:
      const typedAction = action as ICardContentAction;
      return state.set(
        typedAction.cardId,
        cardContent(state.get(typedAction.cardId), action),
      );

    case USER_LOGOUT:
      return state.clear();

    default:
      return state;
  }
}