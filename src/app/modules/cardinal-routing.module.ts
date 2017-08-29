import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../services/auth-guard.service';
import { RedirectService } from '../services/redirect.service';
import { DeckResolver } from '../resolvers/deck.resolver';

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