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

import { LoadingSpinnerComponent } from '../components/controls/loading-spinner/loading-spinner.component'
import { CardCardComponent } from '../components/controls/card-card/card-card.component'
import { DeckCardComponent } from '../components/controls/deck-card/deck-card.component'
import { DeleteCardDialogComponent } from '../components/dialogs/delete-card-dialog/delete-card-dialog.component'
import { DeleteDeckDialogComponent } from '../components/dialogs/delete-deck-dialog/delete-deck-dialog.component'
import { EditCardDialogComponent } from '../components/dialogs/edit-card-dialog/edit-card-dialog.component'
import { EditDeckDialogComponent } from '../components/dialogs/edit-deck-dialog/edit-deck-dialog.component'
import { RootComponent } from '../components/layout/root/root.component'
import { SidenavComponent } from '../components/layout/sidenav/sidenav.component'
import { ToolbarComponent } from '../components/layout/toolbar/toolbar.component'
import { DecksRouteComponent } from '../components/routes/decks-route/decks-route.component'
import { DeckRouteComponent } from '../components/routes/deck-route/deck-route.component'
import { ResetPasswordRouteComponent } from '../components/routes/reset-password-route/reset-password-route.component'
import {
  ResetPasswordConfirmationRouteComponent,
} from '../components/routes/reset-password-confirmation-route/reset-password-confirmation-route.component'
import { ReviewDeckRouteComponent } from '../components/routes/review-deck-route/review-deck-route.component'
import { SignInRouteComponent } from '../components/routes/sign-in-route/sign-in-route.component'
import { SignUpRouteComponent } from '../components/routes/sign-up-route/sign-up-route.component'

import 'hammerjs'

export const config = {
  declarations: [
    RootComponent,
    ToolbarComponent,
    SidenavComponent,
    LoadingSpinnerComponent,
    CardCardComponent,
    DecksRouteComponent,
    DeckCardComponent,
    DeckRouteComponent,
    ResetPasswordRouteComponent,
    ResetPasswordConfirmationRouteComponent,
    ReviewDeckRouteComponent,
    SignInRouteComponent,
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
  ] as any[],
  entryComponents: [
    DeleteCardDialogComponent,
    DeleteDeckDialogComponent,
    EditCardDialogComponent,
    EditDeckDialogComponent,
  ],
  bootstrap: [ RootComponent ]
}

@NgModule(config)
export class CardinalModule {
  constructor(
    logService: LogService,
    snackbarService: MdSnackBar,
  ) {
    logService.error$.subscribe(error => snackbarService.open(error.message, 'Dismiss', { duration: 5000 }))
  }
}
