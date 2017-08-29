import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { MarkdownModule } from 'angular2-markdown';

import { FirebaseModule } from './firebase.module';
import { MaterialModule } from './material.module';
import { CardinalRoutingModule } from './cardinal-routing.module';

import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { GradingService } from '../services/grading.service';

import { RootComponent } from '../components/root/root.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { LoginRouteComponent } from '../components/login-route/login-route.component';
import { LoginButtonComponent } from '../components/login-button/login-button.component';
import { CardCardComponent } from '../components/card-card/card-card.component';
import { DecksRouteComponent } from '../components/decks-route/decks-route.component';
import { DeckCardComponent } from '../components/deck-card/deck-card.component';
import { DeckRouteComponent } from '../components/deck-route/deck-route.component';
import { ReviewDeckRouteComponent } from '../components/review-deck-route/review-deck-route.component';
import { DeleteCardDialog } from '../components/delete-card-dialog/delete-card-dialog.component';
import { DeleteDeckDialog } from '../components/delete-deck-dialog/delete-deck-dialog.component';
import { EditCardDialog } from '../components/edit-card-dialog/edit-card-dialog.component';
import { EditDeckDialog } from '../components/edit-deck-dialog/edit-deck-dialog.component';

import { configureStore } from '../redux/configureStore';
import { UserActions } from '../redux/actions/firebase';
import { IState } from '../redux/state';

import 'hammerjs';

@NgModule({
  declarations: [
    RootComponent,
    ToolbarComponent,
    SidenavComponent,
    LoginRouteComponent,
    LoginButtonComponent,
    CardCardComponent,
    DecksRouteComponent,
    DeckCardComponent,
    DeckRouteComponent,
    ReviewDeckRouteComponent,
    DeleteCardDialog,
    DeleteDeckDialog,
    EditCardDialog,
    EditDeckDialog,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FirebaseModule,
    MarkdownModule.forRoot(),
    CardinalRoutingModule,
    FormsModule,
    NgReduxModule,
  ],
  providers: [
    GradingService,
  ],
  entryComponents: [
    DeleteCardDialog,
    DeleteDeckDialog,
    EditCardDialog,
    EditDeckDialog,
  ],
  bootstrap: [ RootComponent ]
})
export class CardinalModule {
  constructor(
    ngRedux: NgRedux<IState>,
    authService: AuthService,
    databaseService: DatabaseService,
    gradingService: GradingService,
  ) {
    const store = configureStore(ngRedux, authService, databaseService, gradingService);
    ngRedux.provideStore(store);
    store.dispatch(UserActions.startListening({}));
  }
}
