import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  CardContentReducer,
  CardContentEpic,
} from './card-content';

export function createRootEpic(authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    CardContentEpic.createEpic(databaseService._getCardContent),
  );
}

export const rootReducer = combineReducers({
  cardContent: CardContentReducer.reducer,  
});