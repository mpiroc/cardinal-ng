import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { NgRedux } from '@angular-redux/store';

import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { ErrorService } from '../services/error.service';
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
  errorService: ErrorService,
  gradingService: GradingService) {
  return combineEpics(
    UserEpic.createEpic(errorService, _ => authService.user$.map(user => user ? { uid: user.uid } as IUser : null)),
    CardContentEpic.createEpic(errorService, databaseService.getCardContent.bind(databaseService)),
    CardHistoryEpic.createEpic(errorService, databaseService.getCardHistory.bind(databaseService)),
    DeckInfoEpic.createEpic(errorService, databaseService.getDeckInfo.bind(databaseService)),
    DeckEpic.createEpic(errorService, databaseService.getDecks.bind(databaseService)),
    DeckEpic.createStopListeningEpic(errorService),
    CardEpic.createEpic(errorService, databaseService.getCards.bind(databaseService)),
    CardEpic.createStopListeningEpic(errorService),
    createReviewEpic(ngRedux, gradingService),
  );
}
