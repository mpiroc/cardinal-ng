import { combineReducers } from 'redux';
import { user } from './user';
import { deckInfos } from './deck-info';
import { userDecks } from './user-decks';

export const rootReducer = combineReducers({
  user,
  deckInfos,
  userDecks,
});