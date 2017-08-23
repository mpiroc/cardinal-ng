import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
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

export const rootReducer = combineReducers({
  cardContent: CardContentReducer.reducer,  
  cardHistory: CardHistoryReducer.reducer,
  deckInfo: DeckInfoReducer.reducer,
});

export function createRootEpic(authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    CardContentEpic.createEpic(databaseService._getCardContent),
    CardHistoryEpic.createEpic(databaseService._getCardHistory),
    DeckInfoEpic.createEpic(databaseService._getDeckInfo),
  );
}
