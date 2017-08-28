import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { NgRedux } from '@angular-redux/store';
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
import { component } from './component-reducers';
import { createReviewEpic } from './component-epics';
import { IState } from './state';

export const rootReducer = combineReducers({
  user: UserObjectReducer.reducer,
  cardContent: CardContentMapReducer.reducer,  
  cardHistory: CardHistoryMapReducer.reducer,
  deckInfo: DeckInfoMapReducer.reducer,
  userDeck: UserDeckListReducer.reducer,
  deckCard: DeckCardMapReducer.reducer,
  component,
});

export function createRootEpic(ngRedux: NgRedux<IState>, authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    // We need to 1. remove non-serializble members from user; 2. add $key to user.
    UserEpic.createEpic(args => authService.user$.map(user => {
      return user ? {
        $key: user.uid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        providerId: user.providerId,
        uid: user.uid,
      } : null;
    })),
    CardContentEpic.createEpic(databaseService.getCardContent.bind(databaseService)),
    CardHistoryEpic.createEpic(databaseService.getCardHistory.bind(databaseService)),
    DeckInfoEpic.createEpic(databaseService.getDeckInfo.bind(databaseService)),
    UserDeckEpic.createEpic(databaseService.getUserDecks.bind(databaseService)),
    UserDeckEpic.createStopListeningEpic(),
    DeckCardEpic.createEpic(databaseService.getDeckCards.bind(databaseService)),
    DeckCardEpic.createStopListeningEpic(),
    createReviewEpic(ngRedux),
  );
}
