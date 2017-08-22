import { combineEpics } from 'redux-observable';
import { createDeckInfoEpic, createDeckInfoCleanupEpic } from './deck-info';
import { createUserEpic } from './user';
import { createUserDecksEpic } from './user-decks';
import { createDeckCardsEpic } from './deck-cards';
import { createCardContentEpic, createCardContentCleanupEpic } from './card-content';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

export function createRootEpic(authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    createDeckInfoEpic(databaseService),
    //createDeckInfoCleanupEpic(),
    createUserEpic(authService),
    createUserDecksEpic(databaseService),
    createDeckCardsEpic(databaseService),
    createCardContentEpic(databaseService),
    //createCardContentCleanupEpic(),
  );
}
