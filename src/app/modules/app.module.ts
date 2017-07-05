import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FirebaseModule } from './firebase.module';
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
import { AppRoutes } from '../routes/app-routes';

import 'hammerjs';

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
    RouterModule.forRoot(AppRoutes),
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
