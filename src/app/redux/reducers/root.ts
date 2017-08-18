import { combineReducers } from 'redux';
import { user } from './user';
import { deckInfos } from './deck-info';

export const rootReducer = combineReducers({
  user,
  deckInfos,
});