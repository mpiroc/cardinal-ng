import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  UserObjectReducer,
  UserEpic,
  CardContentMapReducer,
  CardContentEpic,
  CardHistoryMapReducer,
  CardHistoryEpic,
  DeckInfoMapReducer,
  DeckInfoEpic,
  UserDeckListReducer,
  UserDeckEpic,
  DeckCardMapReducer,
  DeckCardEpic,
} from './firebase-modules';

export const rootReducer = combineReducers({
  user: UserObjectReducer.reducer.bind(UserObjectReducer),
  cardContent: CardContentMapReducer.reducer.bind(CardContentMapReducer),  
  cardHistory: CardHistoryMapReducer.reducer.bind(CardHistoryMapReducer),
  deckInfo: DeckInfoMapReducer.reducer.bind(DeckInfoMapReducer),
  userDeck: UserDeckListReducer.reducer.bind(UserDeckListReducer),
  deckCard: DeckCardMapReducer.reducer.bind(DeckCardMapReducer),
});

export function createRootEpic(authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    // We need to 1. remove non-serializble members from user; 2. add $key to user.
    UserEpic.createEpic(args => authService.user$.map(user => { return {
      $key: user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerId: user.providerId,
      uid: user.uid,
    }})),
    CardContentEpic.createEpic(databaseService.getCardContent.bind(databaseService)),
    CardHistoryEpic.createEpic(databaseService.getCardHistory.bind(databaseService)),
    DeckInfoEpic.createEpic(databaseService.getDeckInfo.bind(databaseService)),
    UserDeckEpic.createEpic(databaseService.getUserDecks.bind(databaseService)),
    DeckCardEpic.createEpic(databaseService.getDeckCards.bind(databaseService)),
  );
}
