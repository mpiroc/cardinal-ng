import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MarkdownModule } from 'angular2-markdown'
import { MdSnackBar } from '@angular/material'

import { FirebaseModule } from './firebase.module'
import { MaterialModule } from './material.module'
import { CardinalReduxModule } from './cardinal-redux.module'
import { CardinalRoutingModule } from './cardinal-routing.module'
import { LogModule } from './log.module'

import { GradingService, GradingServiceImplementation } from '../services/grading.service'
import { LogService } from '../services/log.service'

import { RootComponent } from '../components/root/root.component'
import { SidenavComponent } from '../components/sidenav/sidenav.component'
import { ToolbarComponent } from '../components/toolbar/toolbar.component'
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component'
import { CardCardComponent } from '../components/card-card/card-card.component'
import { DecksRouteComponent } from '../components/decks-route/decks-route.component'
import { DeckCardComponent } from '../components/deck-card/deck-card.component'
import { DeckRouteComponent } from '../components/deck-route/deck-route.component'
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component'
import { ResetPasswordRouteComponent } from '../components/reset-password-route/reset-password-route.component'
import {
  ResetPasswordConfirmationRouteComponent,
} from '../components/reset-password-confirmation-route/reset-password-confirmation-route.component'
import { ReviewDeckRouteComponent } from '../components/review-deck-route/review-deck-route.component'
import { SignInComponent } from '../components/sign-in/sign-in.component'
import { SignInRouteComponent } from '../components/sign-in-route/sign-in-route.component'
import { SignUpComponent } from '../components/sign-up/sign-up.component'
import { SignUpRouteComponent } from '../components/sign-up-route/sign-up-route.component'
import { DeleteCardDialogComponent } from '../components/delete-card-dialog/delete-card-dialog.component'
import { DeleteDeckDialogComponent } from '../components/delete-deck-dialog/delete-deck-dialog.component'
import { EditCardDialogComponent } from '../components/edit-card-dialog/edit-card-dialog.component'
import { EditDeckDialogComponent } from '../components/edit-deck-dialog/edit-deck-dialog.component'

import 'hammerjs'

@NgModule({
  declarations: [
    RootComponent,
    ToolbarComponent,
    SidenavComponent,
    LoadingSpinnerComponent,
    CardCardComponent,
    DecksRouteComponent,
    DeckCardComponent,
    DeckRouteComponent,
    ResetPasswordComponent,
    ResetPasswordRouteComponent,
    ResetPasswordConfirmationRouteComponent,
    ReviewDeckRouteComponent,
    SignInComponent,
    SignInRouteComponent,
    SignUpComponent,
    SignUpRouteComponent,
    DeleteCardDialogComponent,
    DeleteDeckDialogComponent,
    EditCardDialogComponent,
    EditDeckDialogComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FirebaseModule,
    MarkdownModule.forRoot(),
    CardinalReduxModule,
    CardinalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LogModule,
  ],
  providers: [
    { provide: GradingService, useClass: GradingServiceImplementation },
  ],
  entryComponents: [
    DeleteCardDialogComponent,
    DeleteDeckDialogComponent,
    EditCardDialogComponent,
    EditDeckDialogComponent,
  ],
  bootstrap: [ RootComponent ]
})
export class CardinalModule {
  constructor(
    logService: LogService,
    snackbarService: MdSnackBar,
  ) {
    logService.error$.subscribe(error => snackbarService.open(error.message, 'Dismiss', { duration: 5000 }))
  }
}
