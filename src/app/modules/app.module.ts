import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FirebaseModule } from './firebase.module';
import { AuthGuardService } from '../services/auth-guard.service';
import { MaterialModule } from './material.module';
import { AppComponent } from '../components/app/app.component';
import { AppSidenavComponent } from '../components/app-sidenav/app-sidenav.component';
import { AppToolbarComponent } from '../components/app-toolbar/app-toolbar.component';
import { AppDecksRouteComponent } from '../components/app-decks-route/app-decks-route.component';
import { AppDeckCardComponent } from '../components/app-deck-card/app-deck-card.component';

import 'hammerjs';

const routes = [
  {
    path: 'decks',
    component: AppDecksRouteComponent,
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppSidenavComponent,
    AppDecksRouteComponent,
    AppDeckCardComponent,
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
