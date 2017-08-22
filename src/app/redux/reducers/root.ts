import { combineReducers } from 'redux';
import { user } from './user';
import { deckInfos } from './deck-info';
import { userDecks } from './user-decks';
import { deckCards } from './deck-cards';
import { cardContents } from './card-content';
import { cardHistories } from './card-history';

export const rootReducer = combineReducers({
  user,
  deckInfos,
  userDecks,
  deckCards,
  cardContents,
  cardHistories,
});