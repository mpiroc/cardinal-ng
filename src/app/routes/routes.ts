import { Routes } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { LoginRouteComponent } from '../components/login-route/login-route.component';
import { DecksRouteComponent } from '../components/decks-route/decks-route.component';
import { DeckRouteComponent } from '../components/deck-route/deck-route.component';
import { ReviewDeckRouteComponent } from '../components/review-deck-route/review-deck-route.component';
import { DeckResolver } from '../resolvers/deck.resolver';

export const routes: Routes = [
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