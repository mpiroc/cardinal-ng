import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  UserReducer,
  UserEpic,
  CardContentReducer,
  CardContentEpic,
  CardHistoryReducer,
  CardHistoryEpic,
  DeckInfoReducer,
  DeckInfoEpic,
  UserDeckReducer,
  UserDeckEpic,
  DeckCardReducer,
  DeckCardEpic,
} from './firebase-modules';

export const rootReducer = combineReducers({
  user: UserDeckReducer.reducer.bind(UserDeckReducer),
  cardContent: CardContentReducer.collectionReducer.bind(CardContentReducer),  
  cardHistory: CardHistoryReducer.collectionReducer.bind(CardHistoryReducer),
  deckInfo: DeckInfoReducer.collectionReducer.bind(DeckInfoReducer),
  userDeck: UserDeckReducer.reducer.bind(UserDeckReducer),
  deckCard: DeckCardReducer.reducer.bind(DeckCardReducer),
});

export function createRootEpic(authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    UserEpic.createEpic(args => authService.user$),
    CardContentEpic.createEpic(databaseService.getCardContent),
    CardHistoryEpic.createEpic(databaseService.getCardHistory),
    DeckInfoEpic.createEpic(databaseService.getDeckInfo),
    UserDeckEpic.createEpic(databaseService.getUserDecks),
    DeckCardEpic.createEpic(databaseService.getDeckCards),
  );
}
