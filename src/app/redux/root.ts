import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  UserReducer,
  UserEpic,
} from './user';
import {
  CardContentReducer,
  CardContentEpic,
} from './card-content';
import {
  CardHistoryReducer,
  CardHistoryEpic,
} from './card-history';
import {
  DeckInfoReducer,
  DeckInfoEpic,
} from './deck-info';
import {
  UserDeckReducer,
  UserDeckEpic,
} from './user-deck';
import {
  DeckCardReducer,
  DeckCardEpic,
} from './deck-card';

export const rootReducer = combineReducers({
  user: UserDeckReducer.reducer,
  cardContent: CardContentReducer.reducer,  
  cardHistory: CardHistoryReducer.reducer,
  deckInfo: DeckInfoReducer.reducer,
  userDeck: UserDeckReducer.reducer,
  deckCard: DeckCardReducer.reducer,
});

export function createRootEpic(authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    UserEpic.createEpic(args => authService.user$),
    CardContentEpic.createEpic(databaseService._getCardContent),
    CardHistoryEpic.createEpic(databaseService._getCardHistory),
    DeckInfoEpic.createEpic(databaseService._getDeckInfo),
    UserDeckEpic.createEpic(databaseService._getUserDecks),
    DeckCardEpic.createEpic(databaseService._getDeckCards),
  );
}
