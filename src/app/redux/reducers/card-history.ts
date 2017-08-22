import { Map } from 'immutable';
import { Action } from 'redux';
import { ICardHistory } from '../../models/firebase-models';
import {
  CARD_HISTORY_START_LISTENING,
  CARD_HISTORY_STOP_LISTENING,
  CARD_HISTORY_RECEIVED,
  CARD_HISTORY_ERROR,
  ICardHistoryAction,
  ICardHistoryReceivedAction,
  ICardHistoryErrorAction,
} from '../actions/card-history';
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

const initialCardHistoryState = getInitialItemState();

export function cardHistory(state: Map<string, any> = initialCardHistoryState, action: Action) : Map<string, any> {
  switch (action.type) {
    case CARD_HISTORY_START_LISTENING:
      return onStartListening(state);

    case CARD_HISTORY_STOP_LISTENING:
      return onStopListening(state);

    case CARD_HISTORY_RECEIVED:
      return onItemReceived(state, action as ICardHistoryReceivedAction);

    case CARD_HISTORY_ERROR:
      return onError(state, action as ICardHistoryErrorAction);

    default:
      return state;
  }
}

const initialCardHistoriesState = Map<string, any>();

export function cardHistories(state: Map<string, any> = initialCardHistoriesState, action: Action) {
  switch (action.type) {
    case CARD_HISTORY_START_LISTENING:
    case CARD_HISTORY_STOP_LISTENING:
    case CARD_HISTORY_RECEIVED:
    case CARD_HISTORY_ERROR:
      const typedAction = action as ICardHistoryAction;
      return state.set(
        typedAction.cardId,
        cardHistory(state.get(typedAction.cardId), action),
      );

    case USER_LOGOUT:
      return state.clear();

    default:
      return state;
  }
}