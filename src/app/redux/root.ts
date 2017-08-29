import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { NgRedux } from '@angular-redux/store';

import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  IUser,
} from '../interfaces/firebase';

import {
  UserObjectReducer,
  CardContentMapReducer,
  CardHistoryMapReducer,
  DeckInfoMapReducer,
  UserDeckListReducer,
  DeckCardMapReducer,
} from './reducers/firebase';
import { review } from './reducers/review';
import {
  UserEpic,
  CardContentEpic,
  CardHistoryEpic,
  DeckInfoEpic,
  UserDeckEpic,
  DeckCardEpic,
} from './epics/firebase';
import { createReviewEpic } from './epics/review';
import { IState } from './state';

export const rootReducer = combineReducers({
  user: UserObjectReducer.reducer,
  cardContent: CardContentMapReducer.reducer,  
  cardHistory: CardHistoryMapReducer.reducer,
  deckInfo: DeckInfoMapReducer.reducer,
  userDeck: UserDeckListReducer.reducer,
  deckCard: DeckCardMapReducer.reducer,
  review,
});

export function createRootEpic(ngRedux: NgRedux<IState>, authService: AuthService, databaseService: DatabaseService) {
  return combineEpics(
    // We need to remove non-serializble members from user,
    // so we strip the properties not in firebase.UserInfo.
    UserEpic.createEpic(args => authService.user$.map(user => {
      return user ? {
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        providerId: user.providerId,
        uid: user.uid,
      } as IUser : null;
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
