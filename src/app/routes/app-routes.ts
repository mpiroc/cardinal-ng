import { AuthGuardService } from '../services/auth-guard.service';
import { AppLoginRouteComponent } from '../components/app-login-route/app-login-route.component';
import { AppDecksRouteComponent } from '../components/app-decks-route/app-decks-route.component';
import { AppDeckRouteComponent } from '../components/app-deck-route/app-deck-route.component';

export const AppRoutes = [
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