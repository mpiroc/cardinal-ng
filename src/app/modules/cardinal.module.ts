import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { MarkdownModule } from 'angular2-markdown';
import { MdSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  createEpicMiddleware,
  combineEpics,
  Options,
} from 'redux-observable';
import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
  Action,
} from 'redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FirebaseModule } from './firebase.module';
import { MaterialModule } from './material.module';
import { CardinalRoutingModule } from './cardinal-routing.module';
import { LogModule } from './log.module';

import { AuthService } from '../services/firebase/auth.service';
import { DatabaseService } from '../services/firebase/database.service';
import { GradingService } from '../services/grading.service';
import { LogService } from '../services/log.service';

import { RootComponent } from '../components/root/root.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { CardCardComponent } from '../components/card-card/card-card.component';
import { DecksRouteComponent } from '../components/decks-route/decks-route.component';
import { DeckCardComponent } from '../components/deck-card/deck-card.component';
import { DeckRouteComponent } from '../components/deck-route/deck-route.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { ResetPasswordRouteComponent } from '../components/reset-password-route/reset-password-route.component';
import { ResetPasswordConfirmationRouteComponent } from '../components/reset-password-confirmation-route/reset-password-confirmation-route.component';
import { ReviewDeckRouteComponent } from '../components/review-deck-route/review-deck-route.component';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import { SignInRouteComponent } from '../components/sign-in-route/sign-in-route.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';
import { SignUpRouteComponent } from '../components/sign-up-route/sign-up-route.component';
import { DeleteCardDialogComponent } from '../components/delete-card-dialog/delete-card-dialog.component';
import { DeleteDeckDialogComponent } from '../components/delete-deck-dialog/delete-deck-dialog.component';
import { EditCardDialogComponent } from '../components/edit-card-dialog/edit-card-dialog.component';
import { EditDeckDialogComponent } from '../components/edit-deck-dialog/edit-deck-dialog.component';

import { IUser } from '../interfaces/firebase';
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
import { createReviewEpic } from '../redux/epics/review';
import { IState } from '../redux/state';

import 'hammerjs';

@NgModule({
  declarations: [
    RootComponent,
    ToolbarComponent,
    SidenavComponent,
    LoadingSpinnerComponent,
    CardCardComponent,
    DecksRouteComponent,
    DeckCardComponent,
    DeckRouteComponent,
    ResetPasswordComponent,
    ResetPasswordRouteComponent,
    ResetPasswordConfirmationRouteComponent,
    ReviewDeckRouteComponent,
    SignInComponent,
    SignInRouteComponent,
    SignUpComponent,
    SignUpRouteComponent,
    DeleteCardDialogComponent,
    DeleteDeckDialogComponent,
    EditCardDialogComponent,
    EditDeckDialogComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FirebaseModule,
    MarkdownModule.forRoot(),
    CardinalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxModule,
    LogModule,
  ],
  providers: [
    GradingService,

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
  ],
  entryComponents: [
    DeleteCardDialogComponent,
    DeleteDeckDialogComponent,
    EditCardDialogComponent,
    EditDeckDialogComponent,
  ],
  bootstrap: [ RootComponent ]
})
export class CardinalModule {
  constructor(
    afAuth: AngularFireAuth,
    ngRedux: NgRedux<IState>,
    authService: AuthService,
    databaseService: DatabaseService,
    gradingService: GradingService,
    logService: LogService,
    snackbarService: MdSnackBar,
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
    // TODO: remove
    cardActions: CardActions,
    cardHistoryActions: CardHistoryActions,
  ) {
    logService.error$.subscribe(error => snackbarService.open(error.message, 'Dismiss', { duration: 5000 }));

    const options: Options = {
      adapter: {
        input: (action$: Observable<Action>) => action$.map(action => this.logAction(logService, 'INPUT: ', action)),
        output: (action$: Observable<Action>) => action$.map(action => this.logAction(logService, 'OUTPUT: ', action)),
      }
    }

    const rootEpic = combineEpics(
      userEpic.createEpic(logService, _ => afAuth.authState.map(user => user ? { uid: user.uid } as IUser : null)),
      cardContentEpic.createEpic(logService, databaseService.getCardContent.bind(databaseService)),
      cardHistoryEpic.createEpic(logService, databaseService.getCardHistory.bind(databaseService)),
      deckInfoEpic.createEpic(logService, databaseService.getDeckInfo.bind(databaseService)),
      deckEpic.createEpic(logService, databaseService.getDecks.bind(databaseService)),
      deckEpic.createStopListeningEpic(logService),
      cardEpic.createEpic(logService, databaseService.getCards.bind(databaseService)),
      cardEpic.createStopListeningEpic(logService),
      createReviewEpic(logService, ngRedux, gradingService, cardActions, cardHistoryActions),
    );
    const epicMiddleware = createEpicMiddleware(rootEpic, options);

    const rootReducer = combineReducers({
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
    });

    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
      rootReducer,
      composeEnhancers(applyMiddleware(epicMiddleware)),
    );

    ngRedux.provideStore(store);
    store.dispatch(userActions.beforeStartListening({}));
  }

  logAction(logService: LogService, prefix: string, action: Action): Action {
    logService.debug(prefix + action.type);
    return action;
  }
}
