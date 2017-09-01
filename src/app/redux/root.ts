import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { NgRedux } from '@angular-redux/store';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthService } from '../services/firebase/auth.service';
import { DatabaseService } from '../services/firebase/database.service';
import { LogService } from '../services/log.service';
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
import { editCard } from './reducers/edit-card';
import { editDeck } from './reducers/edit-deck';
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
  editCard,
  editDeck,
});

export function createRootEpic(
  afAuth: AngularFireAuth,
  ngRedux: NgRedux<IState>,
  authService: AuthService,
  databaseService: DatabaseService,
  gradingService: GradingService,
  logService: LogService) {
  return combineEpics(
    UserEpic.createEpic(logService, _ => afAuth.authState.map(user => user ? { uid: user.uid } as IUser : null)),
    CardContentEpic.createEpic(logService, databaseService.getCardContent.bind(databaseService)),
    CardHistoryEpic.createEpic(logService, databaseService.getCardHistory.bind(databaseService)),
    DeckInfoEpic.createEpic(logService, databaseService.getDeckInfo.bind(databaseService)),
    DeckEpic.createEpic(logService, databaseService.getDecks.bind(databaseService)),
    DeckEpic.createStopListeningEpic(logService),
    CardEpic.createEpic(logService, databaseService.getCards.bind(databaseService)),
    CardEpic.createStopListeningEpic(logService),
    createReviewEpic(logService, ngRedux, gradingService),
  );
}
