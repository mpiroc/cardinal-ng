import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogModule } from './log.module';

import { AuthGuardService } from '../services/routing/auth-guard.service';
import { RedirectService } from '../services/routing/redirect.service';
import { DeckResolver } from '../services/routing/deck-resolver.service';

import { LoginRouteComponent } from '../components/login-route/login-route.component';
import { DecksRouteComponent } from '../components/decks-route/decks-route.component';
import { DeckRouteComponent } from '../components/deck-route/deck-route.component';
import { ReviewDeckRouteComponent } from '../components/review-deck-route/review-deck-route.component';

import { environment } from '../../environments/environment';

const routes: Routes = [
  {
    path: 'login',
    component: LoginRouteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'decks',
    component: DecksRouteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'deck/:deckId',
    component: DeckRouteComponent,
    canActivate: [AuthGuardService],
    resolve: {
      deck: DeckResolver,
    },
  },
  {
    path: 'review/:deckId',
    component: ReviewDeckRouteComponent,
    canActivate: [AuthGuardService],
    resolve: {
      deck: DeckResolver,
    },
  },
  {
    path: '**',
    redirectTo: 'decks',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, environment.routing),
    LogModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    DeckResolver,
    AuthGuardService,
    RedirectService,
  ],
})
export class CardinalRoutingModule {
  constructor(private redirectService: RedirectService) {
    redirectService.startListening();
  }
}