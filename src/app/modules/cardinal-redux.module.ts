import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  createEpicMiddleware,
  combineEpics,
} from 'redux-observable';
import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
} from 'redux';

import { FirebaseModule } from './firebase.module';
import { LogModule } from './log.module';

import { DatabaseService } from '../services/firebase/database.service';
import { GradingService } from '../services/grading.service';
import { LogService } from '../services/log.service';

import {
  CardContentActions,
  CardHistoryActions,
  CardActions,
  DeckInfoActions,
  DeckActions,
  UserActions,
} from '../redux/actions/firebase';
import {
  CardContentObjectReducer,
  CardContentMapReducer,
  CardHistoryObjectReducer,
  CardHistoryMapReducer,
  CardListReducer,
  CardMapReducer,
  DeckInfoObjectReducer,
  DeckInfoMapReducer,
  DeckListReducer,
  UserObjectReducer,
} from '../redux/reducers/firebase';
import {
  CardEpic,
  CardContentEpic,
  CardHistoryEpic,
  DeckInfoEpic,
  DeckEpic,
  UserEpic,
} from '../redux/epics/firebase';
import { review } from '../redux/reducers/review';
import { editCard } from '../redux/reducers/edit-card';
import { editDeck } from '../redux/reducers/edit-deck';
import { signIn } from '../redux/reducers/sign-in';
import { signUp } from '../redux/reducers/sign-up';
import { resetPassword } from '../redux/reducers/reset-password';
import { ReviewEpic } from '../redux/epics/review';
import { IState } from '../redux/state';

@NgModule({
  imports: [
    FirebaseModule,
    NgReduxModule,
    LogModule,
  ],
  exports: [
    NgReduxModule,
  ],
  providers: [
    // Actions
    CardContentActions,
    CardHistoryActions,
    CardActions,
    DeckInfoActions,
    DeckActions,
    UserActions,

    // Reducers
    CardContentObjectReducer,
    CardContentMapReducer,
    CardHistoryObjectReducer,
    CardHistoryMapReducer,
    CardListReducer,
    CardMapReducer,
    DeckInfoObjectReducer,
    DeckInfoMapReducer,
    DeckListReducer,
    UserObjectReducer,

    // Epics
    CardEpic,
    CardContentEpic,
    CardHistoryEpic,
    DeckInfoEpic,
    DeckEpic,
    UserEpic,
    ReviewEpic,
  ],
})
export class CardinalReduxModule {
  constructor(
    afAuth: AngularFireAuth,
    ngRedux: NgRedux<IState>,
    databaseService: DatabaseService,
    gradingService: GradingService,
    logService: LogService,

    // Redux services
    userActions: UserActions,
    userObjectReducer: UserObjectReducer,
    cardContentMapReducer: CardContentMapReducer,
    cardHistoryMapReducer: CardHistoryMapReducer,
    deckInfoMapReducer: DeckInfoMapReducer,
    deckListReducer: DeckListReducer,
    cardMapReducer: CardMapReducer,
    userEpic: UserEpic,
    cardContentEpic: CardContentEpic,
    cardHistoryEpic: CardHistoryEpic,
    deckInfoEpic: DeckInfoEpic,
    deckEpic: DeckEpic,
    cardEpic: CardEpic,
    reviewEpic: ReviewEpic,
  ) {
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
      combineReducers({
        user: userObjectReducer.reducer,
        cardContent: cardContentMapReducer.reducer,
        cardHistory: cardHistoryMapReducer.reducer,
        deckInfo: deckInfoMapReducer.reducer,
        deck: deckListReducer.reducer,
        card: cardMapReducer.reducer,
        review,
        editCard,
        editDeck,
        signIn,
        signUp,
        resetPassword,
      }),
      composeEnhancers(applyMiddleware(createEpicMiddleware(combineEpics(
        cardContentEpic.epic,
        cardHistoryEpic.epic,
        cardEpic.epic,
        cardEpic.stopListeningEpic,
        deckInfoEpic.epic,
        deckEpic.epic,
        deckEpic.stopListeningEpic,
        userEpic.epic,
        reviewEpic.epic,
      )))),
    );

    ngRedux.provideStore(store);
    store.dispatch(userActions.beforeStartListening({}));
  }
}
