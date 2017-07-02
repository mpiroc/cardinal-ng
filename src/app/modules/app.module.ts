import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FirebaseModule } from './firebase.module';
import { AuthGuardService } from '../services/auth-guard.service';
import { MaterialModule } from './material.module';
import { AppComponent } from '../components/app/app.component';
import { AppSidenavComponent } from '../components/app-sidenav/app-sidenav.component';
import { AppToolbarComponent } from '../components/app-toolbar/app-toolbar.component';
import { AppLoginRouteComponent } from '../components/app-login-route/app-login-route.component';
import { AppLoginButtonComponent } from '../components/app-login-button/app-login-button.component';
import { AppCardCardComponent } from '../components/app-card-card/app-card-card.component';
import { AppDecksRouteComponent } from '../components/app-decks-route/app-decks-route.component';
import { AppDeckCardComponent } from '../components/app-deck-card/app-deck-card.component';
import { AppDeckRouteComponent } from '../components/app-deck-route/app-deck-route.component';

import 'hammerjs';

const routes = [
  {
    path: 'login',
    component: AppLoginRouteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'decks',
    component: AppDecksRouteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'deck/:deckId',
    component: AppDeckRouteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    redirectTo: 'decks',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppSidenavComponent,
    AppLoginRouteComponent,
    AppLoginButtonComponent,
    AppCardCardComponent,
    AppDecksRouteComponent,
    AppDeckCardComponent,
    AppDeckRouteComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FirebaseModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
