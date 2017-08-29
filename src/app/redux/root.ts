import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { NgRedux } from '@angular-redux/store';

import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { GradingService } from '../services/grading.service';
import {
  IUser,
} from '../interfaces/firebase';

import {
  UserObjectReducer,
  CardContentMapReducer,
  CardHistoryMapReducer,
  DeckInfoMapReducer,
  DeckListReducer,
  CardMapReducer,
} from './reducers/firebase';
import { review } from './reducers/review';
import {
  UserEpic,
  CardContentEpic,
  CardHistoryEpic,
  DeckInfoEpic,
  DeckEpic,
  CardEpic,
} from './epics/firebase';
import { createReviewEpic } from './epics/review';
import { IState } from './state';

export const rootReducer = combineReducers({
  user: UserObjectReducer.reducer,
  cardContent: CardContentMapReducer.reducer,  
  cardHistory: CardHistoryMapReducer.reducer,
  deckInfo: DeckInfoMapReducer.reducer,
  deck: DeckListReducer.reducer,
  card: CardMapReducer.reducer,
  review,
});

export function createRootEpic(
  ngRedux: NgRedux<IState>,
  authService: AuthService,
  databaseService: DatabaseService,
  gradingService: GradingService,
  ) {
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
    DeckEpic.createEpic(databaseService.getDecks.bind(databaseService)),
    DeckEpic.createStopListeningEpic(),
    CardEpic.createEpic(databaseService.getCards.bind(databaseService)),
    CardEpic.createStopListeningEpic(),
    createReviewEpic(ngRedux, gradingService),
  );
}
