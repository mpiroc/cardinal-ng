import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { MarkdownModule } from 'angular2-markdown';

import { FirebaseModule } from './firebase.module';
import { MaterialModule } from './material.module';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { GradingService } from '../services/grading.service';
import { RedirectService } from '../services/redirect.service';
import { DeckResolver } from '../resolvers/deck.resolver';
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
import { routes } from '../routes/routes';
import { configureStore } from '../redux/configureStore';
import { UserActions } from '../redux/firebase-modules';
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
    RouterModule.forRoot(routes),
    FormsModule,
    NgReduxModule,
  ],
  providers: [
    GradingService,
    RedirectService,
    DeckResolver,
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
    redirectService: RedirectService,
    ) {
    const store = configureStore(ngRedux, authService, databaseService);
    ngRedux.provideStore(store);
    store.dispatch(UserActions.startListening({}));
    
    redirectService.startListening();
  }
}
