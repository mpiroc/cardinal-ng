import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogModule } from './log.module';

import { AuthGuardService } from '../services/routing/auth-guard.service';
import { RedirectService } from '../services/routing/redirect.service';
import { DeckResolver } from '../services/routing/deck-resolver.service';
import { UserResolver } from '../services/routing/user-resolver.service';

import { SignInRouteComponent } from '../components/sign-in-route/sign-in-route.component';
import { DecksRouteComponent } from '../components/decks-route/decks-route.component';
import { DeckRouteComponent } from '../components/deck-route/deck-route.component';
import { ReviewDeckRouteComponent } from '../components/review-deck-route/review-deck-route.component';

import { environment } from '../../environments/environment';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInRouteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'decks',
    component: DecksRouteComponent,
    canActivate: [AuthGuardService],
    resolve: {
      user: UserResolver,
    }
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
    UserResolver,
    AuthGuardService,
    RedirectService,
  ],
})
export class CardinalRoutingModule {
  constructor(private redirectService: RedirectService) {
    redirectService.startListening();
  }
}
