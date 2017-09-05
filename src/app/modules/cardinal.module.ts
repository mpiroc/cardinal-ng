import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { MarkdownModule } from 'angular2-markdown';
import { MdSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';

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
import { ReviewDeckRouteComponent } from '../components/review-deck-route/review-deck-route.component';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import { SignInRouteComponent } from '../components/sign-in-route/sign-in-route.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';
import { SignUpRouteComponent } from '../components/sign-up-route/sign-up-route.component';
import { DeleteCardDialogComponent } from '../components/delete-card-dialog/delete-card-dialog.component';
import { DeleteDeckDialogComponent } from '../components/delete-deck-dialog/delete-deck-dialog.component';
import { EditCardDialogComponent } from '../components/edit-card-dialog/edit-card-dialog.component';
import { EditDeckDialogComponent } from '../components/edit-deck-dialog/edit-deck-dialog.component';

import { configureStore } from '../redux/configureStore';
import { UserActions } from '../redux/actions/firebase';
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
  ) {
    logService.error$.subscribe(error => snackbarService.open(error.message, 'Dismiss', { duration: 5000 }));

    const store = configureStore(afAuth, ngRedux, authService, databaseService, gradingService, logService);
    ngRedux.provideStore(store);
    store.dispatch(UserActions.beforeStartListening({}));
  }
}
