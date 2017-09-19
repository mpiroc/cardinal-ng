import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { CardCardComponent } from './card-card.component'

import { Map } from 'immutable'
import { SimpleChange } from '@angular/core'
import { NgRedux } from '@angular-redux/store'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import { IStore } from 'redux-mock-store'
import { AuthService, AuthServiceImplementation } from '../../../services/firebase/auth.service'
import { DatabaseService, DatabaseServiceImplementation } from '../../../services/firebase/database.service'
import { GradingService, GradingServiceImplementation } from '../../../services/grading.service'
import { LogService, LogServiceImplementation } from '../../../services/log.service'
import { IState } from '../../../redux/state'
import {
  editCardSetFront,
  editCardSetBack,
} from '../../../redux/actions/edit-card'
import { CardContentActions } from '../../../redux/actions/firebase'
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
import {
  expectEqual,
  configureMockStore,
  createMockState,
  NgReduxExtension,
} from '../../../utils/test-utils.spec'

import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MarkdownModule } from 'angular2-markdown'
import { MaterialModule } from '../../../modules/material.module'
import { CardinalRoutingModule } from '../../../modules/cardinal-routing.module'

import {
  MdDialog,
  MdDialogRef,
} from '@angular/material'
import { EditCardDialogComponent, EditCardDialogResult } from '../../dialogs/edit-card-dialog/edit-card-dialog.component'
import { DeleteCardDialogComponent, DeleteCardDialogResult } from '../../dialogs/delete-card-dialog/delete-card-dialog.component'

function updateCard(component: CardCardComponent, cardId: string) {
  const card = {
    uid: undefined,
    deckId: undefined,
    cardId,
  }
  component.card = card
  component.ngOnChanges({
    card: new SimpleChange(null, card, true),
  })

  return card
}

describe('components', () => {
  describe('CardCardComponent', () => {
    let errorMessages: string[]
    let cardContentActions: CardContentActions
    let store: IStore<IState>
    let isLoadingSubject: Subject<boolean>
    let frontSubject: Subject<string>
    let backSubject: Subject<string>
    let editDialogSubject: Subject<EditCardDialogResult>
    let deleteDialogSubject: Subject<DeleteCardDialogResult>
    let databaseServiceMock: DatabaseService
    let component: CardCardComponent

    beforeEach(async(() => {
      errorMessages = []
      cardContentActions = new CardContentActions()
      isLoadingSubject = new Subject<boolean>()
      frontSubject = new Subject<string>()
      backSubject = new Subject<string>()
      editDialogSubject = new Subject<EditCardDialogResult>()
      deleteDialogSubject = new Subject<DeleteCardDialogResult>()
      store = configureMockStore(undefined, {
        editCard: Map<string, any>({
          front: 'myFront',
          back: 'myBack',
        })
      })
      databaseServiceMock = mock(DatabaseServiceImplementation)
      const logServiceMock = mock(LogServiceImplementation)
      const ngReduxMock = mock(NgReduxExtension)
      const editDialogRefMock = mock(MdDialogRef)
      const deleteDialogRefMock = mock(MdDialogRef)
      const dialogMock = mock(MdDialog)

      when(databaseServiceMock.updateCardContent(anything(), anything(), anything()))
        .thenReturn(Promise.resolve())
      when(databaseServiceMock.deleteCard(anything()))
        .thenReturn(Promise.resolve([]))

      when(logServiceMock.error(anything())).thenCall(message => errorMessages.push(message))

      when(ngReduxMock.dispatch(anything())).thenCall(action => store.dispatch(action))
      when(ngReduxMock.getState()).thenReturn(store.getState())
      when(ngReduxMock.select(deepEqual(['cardContent', 'myCardId', 'isLoading'])))
        .thenReturn(isLoadingSubject)
      when(ngReduxMock.select(deepEqual(['cardContent', 'myCardId', 'data', 'front'])))
        .thenReturn(frontSubject)
      when(ngReduxMock.select(deepEqual(['cardContent', 'myCardId', 'data', 'back'])))
        .thenReturn(backSubject)

      when(editDialogRefMock.afterClosed()).thenReturn(editDialogSubject)
      when(deleteDialogRefMock.afterClosed()).thenReturn(deleteDialogSubject)
      when(dialogMock.open(EditCardDialogComponent, anything())).thenReturn(instance(editDialogRefMock))
      when(dialogMock.open(DeleteCardDialogComponent)).thenReturn(instance(deleteDialogRefMock))

      const testModuleConfig = {
        ...config,
        imports: [
          BrowserModule,
          MaterialModule,
          MarkdownModule.forRoot(),
          CardinalRoutingModule,
          FormsModule,
          ReactiveFormsModule,
        ],
        providers: [
          { provide: AuthService, useValue: instance(mock(AuthServiceImplementation)) },
          { provide: DatabaseService, useValue: instance(databaseServiceMock) },
          { provide: GradingService, useValue: instance(mock(GradingServiceImplementation)) },
          { provide: LogService, useValue: instance(logServiceMock) },
          { provide: NgRedux, useValue: instance(ngReduxMock) },
          { provide: CardContentActions, useValue: cardContentActions },
          { provide: MdDialog, useValue: instance(dialogMock) },
        ],
      }

      TestBed.configureTestingModule(testModuleConfig).compileComponents()

      const fixture = TestBed.createComponent(CardCardComponent)
      component = fixture.debugElement.componentInstance
    }))

    describe('main component', () => {
      it('should initialize without errors', async(() => {
        expectEqual(errorMessages, [])
        expect(component).toBeTruthy()
      }))

      it('should start listening for card content', async(() => {
        const card = updateCard(component, 'myCardId')
        isLoadingSubject.next(false)
        frontSubject.next('myFront')
        backSubject.next('myBack')

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card)
        ])
      }))
    })

    describe('edit card dialog', () => {
      it('should cancel the edit card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        editDialogSubject.next(EditCardDialogResult.Cancel)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
          editCardSetFront(null),
          editCardSetBack(null),
        ])
        verify(databaseServiceMock.updateCardContent(anything(), anything(), anything())).never()
      }))

      it('should save the edit card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        editDialogSubject.next(EditCardDialogResult.Save)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
          editCardSetFront(null),
          editCardSetBack(null),
        ])
        verify(databaseServiceMock.updateCardContent(deepEqual(card), 'myFront', 'myBack')).once()
      }))

      it('should pass card front and back to the edit card dialog', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        frontSubject.next('myFront2')
        backSubject.next('myBack2')
        editDialogSubject.next(EditCardDialogResult.Save)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
          editCardSetFront('myFront2'),
          editCardSetBack('myBack2'),
          editCardSetFront(null),
          editCardSetBack(null),
        ])
      }))

      it('should catch and log edit card dialog errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        editDialogSubject.error(new Error('myError'))

        expectEqual(errorMessages, [ 'myError' ])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
          // TODO: editCardError('myError'),
        ])
      }))

      it('should throw an error on unexpected card deck dialog result', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        editDialogSubject.next(42)
        expectEqual(errorMessages, [ 'Unknown dialog response: 42' ])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
          editCardSetFront(null),
          editCardSetBack(null),
        ])
      }))

      it('should unsubscribe from observables on edit card success', async (done) => {
        const card = updateCard(component, 'myCardId')
        const { subscription, complete } = component.onEdit()

        editDialogSubject.next(EditCardDialogResult.Save)

        await complete

        expectEqual(errorMessages, [])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on edit card failure', async (done) => {
        const card = updateCard(component, 'myCardId')
        const { subscription, complete } = component.onEdit()

        editDialogSubject.error(new Error('myError'))

        await complete

        expectEqual(errorMessages, ['myError'])
        expect(subscription.closed).toEqual(true)

        done()
      })

    })

    describe('delete card dialog', () => {
      it('should cancel the delete card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.next(DeleteCardDialogResult.Cancel)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
        ])
        verify(databaseServiceMock.deleteCard(anything())).never()
      }))

      it('should save the delete card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.next(DeleteCardDialogResult.Ok)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
        ])
        verify(databaseServiceMock.deleteCard(deepEqual(card))).once()
      }))

      it('should catch and log delete card dialog errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.error(new Error('myError'))

        expectEqual(errorMessages, [ 'myError' ])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
          // TODO: deleteCardError('myError'),
        ])
      }))

      it('should throw an error on unexpected delete card dialog result', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.next(42)
        expectEqual(errorMessages, [ 'Unknown dialog response: 42' ])
        expectEqual(store.getActions(), [
          cardContentActions.beforeStartListening(card),
          // TODO: deleteDialogError('Unknown dialog response: 42'),
        ])
      }))

      it('should unsubscribe from observables on delete card success', async (done) => {
        const card = updateCard(component, 'myCardId')
        const { subscription, complete } = component.onDelete()

        deleteDialogSubject.next(DeleteCardDialogResult.Ok)

        await complete

        expectEqual(errorMessages, [])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on delete card failure', async (done) => {
        const card = updateCard(component, 'myCardId')
        const { subscription, complete } = component.onDelete()

        deleteDialogSubject.error(new Error('myError'))

        await complete

        expectEqual(errorMessages, ['myError'])
        expect(subscription.closed).toEqual(true)

        done()
      })
    })
  })
})
