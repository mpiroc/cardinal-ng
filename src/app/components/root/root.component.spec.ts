import { TestBed, async } from '@angular/core/testing'

import { MarkdownModule } from 'angular2-markdown'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { FirebaseModule } from '../../modules/firebase.module'
import { MaterialModule } from '../../modules/material.module'
import { CardinalReduxModule } from '../../modules/cardinal-redux.module'
import { CardinalRoutingModule } from '../../modules/cardinal-routing.module'

import { GradingService } from '../../services/grading.service'

import { CardCardComponent } from '../card-card/card-card.component'
import { DeckCardComponent } from '../deck-card/deck-card.component'
import { DeckRouteComponent } from '../deck-route/deck-route.component'
import { DecksRouteComponent } from '../decks-route/decks-route.component'
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component'
import {
  ResetPasswordConfirmationRouteComponent,
} from '../reset-password-confirmation-route/reset-password-confirmation-route.component'
import { ResetPasswordComponent } from '../reset-password/reset-password.component'
import { ResetPasswordRouteComponent } from '../reset-password-route/reset-password-route.component'
import { ReviewDeckRouteComponent } from '../review-deck-route/review-deck-route.component'
import { RootComponent } from './root.component'
import { SidenavComponent } from '../sidenav/sidenav.component'
import { SignInComponent } from '../sign-in/sign-in.component'
import { SignInRouteComponent } from '../sign-in-route/sign-in-route.component'
import { SignUpComponent } from '../sign-up/sign-up.component'
import { SignUpRouteComponent } from '../sign-up-route/sign-up-route.component'
import { ToolbarComponent } from '../toolbar/toolbar.component'

describe('RootComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FirebaseModule,
        MarkdownModule.forRoot(),
        CardinalReduxModule,
        CardinalRoutingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        GradingService,
      ],
      declarations: [
        CardCardComponent,
        DeckCardComponent,
        DeckRouteComponent,
        DecksRouteComponent,
        LoadingSpinnerComponent,
        ResetPasswordConfirmationRouteComponent,
        ResetPasswordComponent,
        ResetPasswordRouteComponent,
        ReviewDeckRouteComponent,
        RootComponent,
        SidenavComponent,
        SignInComponent,
        SignInRouteComponent,
        SignUpComponent,
        SignUpRouteComponent,
        ToolbarComponent,
      ],
    }).compileComponents()
  }))

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(RootComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))
})
