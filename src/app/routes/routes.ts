import { AuthGuardService } from '../services/auth-guard.service';
import { LoginRouteComponent } from '../components/login-route/login-route.component';
import { DecksRouteComponent } from '../components/decks-route/decks-route.component';
import { DeckRouteComponent } from '../components/deck-route/deck-route.component';

export const Routes = [
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
  },
  {
    path: '**',
    redirectTo: 'decks',
  },
];