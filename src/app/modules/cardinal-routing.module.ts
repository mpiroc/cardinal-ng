import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LogModule } from './log.module'

import { AuthGuardService, AuthGuardServiceImplementation } from '../services/routing/auth-guard.service'
import { DeckResolver, DeckResolverImplementation } from '../services/routing/deck-resolver.service'
import { RedirectService, RedirectServiceImplementation } from '../services/routing/redirect.service'
import { RouterShimService, RouterShimServiceImplementation } from '../services/routing/router-shim.service'
import { UserResolver, UserResolverImplementation } from '../services/routing/user-resolver.service'

import { SignInRouteComponent } from '../components/routes/sign-in-route/sign-in-route.component'
import { SignUpRouteComponent } from '../components/routes/sign-up-route/sign-up-route.component'
import { DecksRouteComponent } from '../components/routes/decks-route/decks-route.component'
import { DeckRouteComponent } from '../components/routes/deck-route/deck-route.component'
import { ResetPasswordRouteComponent } from '../components/routes/reset-password-route/reset-password-route.component'
import {
  ResetPasswordConfirmationRouteComponent,
} from '../components/routes/reset-password-confirmation-route/reset-password-confirmation-route.component'
import { ReviewDeckRouteComponent } from '../components/routes/review-deck-route/review-deck-route.component'

import { environment } from '../../environments/environment'

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInRouteComponent,
  },
  {
    path: 'sign-up',
    component: SignUpRouteComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordRouteComponent,
  },
  {
    path: 'reset-password-confirmation',
    component: ResetPasswordConfirmationRouteComponent,
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
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, environment.routing),
    LogModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    { provide: AuthGuardService, useClass: AuthGuardServiceImplementation },
    { provide: DeckResolver, useClass: DeckResolverImplementation },
    { provide: RedirectService, useClass: RedirectServiceImplementation },
    { provide: RouterShimService, useClass: RouterShimServiceImplementation },
    { provide: UserResolver, useClass: UserResolverImplementation },
  ],
})
export class CardinalRoutingModule {
  constructor(private redirectService: RedirectService) {
    redirectService.startListening()
  }
}
