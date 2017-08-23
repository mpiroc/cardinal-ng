import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  UserItemReducer,
  UserEpic,
  CardContentCollectionReducer,
  CardContentEpic,
  CardHistoryCollectionReducer,
  CardHistoryEpic,
  DeckInfoCollectionReducer,
  DeckInfoEpic,
  UserDeckListReducer,
  UserDeckEpic,
  DeckCardCollectionReducer,
  DeckCardEpic,
} from './firebase-modules';

export const rootReducer = combineReducers({
  user: UserItemReducer.reducer.bind(UserItemReducer),
  cardContent: CardContentCollectionReducer.reducer.bind(CardContentCollectionReducer),  
  cardHistory: CardHistoryCollectionReducer.reducer.bind(CardHistoryCollectionReducer),
  deckInfo: DeckInfoCollectionReducer.reducer.bind(DeckInfoCollectionReducer),
  userDeck: UserDeckListReducer.reducer.bind(UserDeckListReducer),
  deckCard: DeckCardCollectionReducer.reducer.bind(DeckCardCollectionReducer),
});

export function createRootEpic(authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    UserEpic.createEpic(args => authService.user$.map(user => { return {
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
