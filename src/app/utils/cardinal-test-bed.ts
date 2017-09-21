import { TestBed } from '@angular/core/testing'
import { NgRedux } from '@angular-redux/store'
import { SimpleChange, TemplateRef } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ComponentType } from '@angular/cdk/portal'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import { Action } from 'redux'
import { IStore } from 'redux-mock-store'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MarkdownModule } from 'angular2-markdown'
import {
  MdDialog,
  MdDialogRef,
} from '@angular/material'

import { MaterialModule } from '../modules/material.module'
import { config } from '../modules/cardinal.module'
import { AuthService, AuthServiceImplementation } from '../services/firebase/auth.service'
import { DatabaseService, DatabaseServiceImplementation } from '../services/firebase/database.service'
import { GradingService, GradingServiceImplementation } from '../services/grading.service'
import { LogService, LogServiceImplementation } from '../services/log.service'
import { IState } from '../redux/state'
import {
  CardContentActions,
  CardHistoryActions,
  CardActions,
  DeckInfoActions,
  DeckActions,
  UserActions,
} from '../redux/actions/firebase'
import {
  expectEqual,
  configureMockStore,
  NgReduxExtension,
} from './test-utils.spec'

import {
  instance,
  mock,
  when,
  verify,
  deepEqual,
  anyString,
  anyNumber,
  anything,
} from 'ts-mockito'


export class CardinalTestBed {
  private errorMessages: string[]
  private store: IStore<IState>

  private _authServiceMock: AuthService
  private _databaseServiceMock: DatabaseService
  private _dialogMock: MdDialog
  private _gradingServiceMock: GradingService
  private _logServiceMock: LogService
  private _ngReduxMock: NgRedux<IState>

  readonly cardContentActions = new CardContentActions()
  readonly cardHistoryActions = new CardHistoryActions()
  readonly cardActions = new CardActions()
  readonly deckInfoActions = new DeckInfoActions()
  readonly deckActions = new DeckActions()
  readonly userActions = new UserActions()

  get authServiceMock() {
    return this._authServiceMock
  }

  get databaseServiceMock() {
    return this._databaseServiceMock
  }

  get dialogMock() {
    return this._dialogMock
  }

  get gradingServiceMock() {
    return this._gradingServiceMock
  }

  get logServiceMock() {
    return this._logServiceMock
  }

  get ngReduxMock() {
    return this._ngReduxMock
  }

  constructor(initialState: IState = {}) {
    this.errorMessages = []
    this.store = configureMockStore(initialState)

    this._authServiceMock = mock(AuthServiceImplementation)
    this._databaseServiceMock = mock(DatabaseServiceImplementation)
    this._dialogMock = mock(MdDialog)
    this._gradingServiceMock = mock(GradingServiceImplementation)
    this._logServiceMock = mock(LogServiceImplementation)
    this._ngReduxMock = mock(NgReduxExtension)

    when(this.logServiceMock.error(anything()))
      .thenCall(message => this.errorMessages.push(message))
    when(this.ngReduxMock.dispatch(anything()))
      .thenCall(action => this.store.dispatch(action))
    when(this.ngReduxMock.getState())
      .thenReturn(this.store.getState())
  }

  whenSelect<T>(path: string[]) {
    const result = new Subject<T>()
    when(this._ngReduxMock.select(deepEqual(path))).thenReturn(result)

    return result
  }

  whenOpenDialog<TComponent, TResult>(
    componentOrTemplateRef: ComponentType<TComponent> | TemplateRef<TComponent>,
  ) {
    const subject = new Subject<TResult>()
    const dialogRefMock = mock(MdDialogRef)
    when(dialogRefMock.afterClosed()).thenReturn(subject)
    when(this.dialogMock.open(componentOrTemplateRef))
      .thenReturn(instance(dialogRefMock))
    when(this.dialogMock.open(componentOrTemplateRef, anything()))
      .thenReturn(instance(dialogRefMock))

    return subject
  }

  configure(extraProviders: any[] = []) {
    const providers = [
      { provide: AuthService, useValue: instance(this.authServiceMock) },
      { provide: DatabaseService, useValue: instance(this.databaseServiceMock) },
      { provide: MdDialog, useValue: instance(this.dialogMock) },
      { provide: GradingService, useValue: instance(this.gradingServiceMock) },
      { provide: LogService, useValue: instance(this.logServiceMock) },
      { provide: NgRedux, useValue: instance(this.ngReduxMock) },

      { provide: CardContentActions, useValue: this.cardContentActions },
      { provide: CardHistoryActions, useValue: this.cardHistoryActions },
      { provide: CardActions, useValue: this.cardActions },
      { provide: DeckInfoActions, useValue: this.deckInfoActions },
      { provide: DeckActions, useValue: this.deckActions },
      { provide: UserActions, useValue: this.userActions },
    ].concat(extraProviders)

    const imports = [
      BrowserModule,
      RouterModule,
      MaterialModule,
      MarkdownModule.forRoot(),
      FormsModule,
      ReactiveFormsModule,
    ]

    TestBed.configureTestingModule({
      declarations: config.declarations,
      imports,
      providers,
    }).compileComponents()
  }

  expectErrors(messages: string[]) {
    expectEqual(this.errorMessages, messages)
  }

  expectActions(actions: Action[]) {
    return expectEqual(this.store.getActions(), actions)
  }
}