import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { DeckCardComponent } from './deck-card.component'

import { Map } from 'immutable'
import { Subject } from 'rxjs/Subject'
import { SimpleChange } from '@angular/core'
import {
  MdDialog,
  MdDialogRef,
} from '@angular/material'
import { NgRedux } from '@angular-redux/store'
import { IDeck, IDeckInfo, ICard } from '../../../interfaces/firebase'
import { IState } from '../../../redux/state'
import { AuthService, AuthServiceImplementation } from '../../../services/firebase/auth.service'
import { DatabaseService, DatabaseServiceImplementation } from '../../../services/firebase/database.service'
import { GradingService, GradingServiceImplementation } from '../../../services/grading.service'
import { LogService, LogServiceImplementation } from '../../../services/log.service'
import { EditDeckDialogComponent, EditDeckDialogResult } from '../../dialogs/edit-deck-dialog/edit-deck-dialog.component'
import { DeleteDeckDialogComponent, DeleteDeckDialogResult } from '../../dialogs/delete-deck-dialog/delete-deck-dialog.component'
import {
  DeckInfoActions,
  CardActions,
} from '../../../redux/actions/firebase'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MarkdownModule } from 'angular2-markdown'
import { MaterialModule } from '../../../modules/material.module'
import { CardinalRoutingModule } from '../../../modules/cardinal-routing.module'
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../../redux/actions/edit-deck'

import { IStore } from 'redux-mock-store'
import {
  instance,
  mock,
  when,
  verify,
  anything,
  deepEqual,
} from 'ts-mockito'
import {
  expectEqual,
  configureMockStore,
  createMockState,
  NgReduxExtension,
} from '../../../utils/test-utils.spec'

function updateDeck(component: DeckCardComponent, deckId: string) {
  const deck = {
    uid: undefined,
    deckId,
  }
  component.deck = deck
  component.ngOnChanges({
    deck: new SimpleChange(null, deck, true),
  })

  return deck
}

describe('components', () => {
  describe('DeckCardComponent', () => {
    let errorMessages: string[]
    let deckInfoActions: DeckInfoActions
    let cardActions: CardActions
    let store: IStore<IState>
    let isLoadingSubject: Subject<boolean>
    let nameSubject: Subject<string>
    let descriptionSubject: Subject<string>
    let cardsSubject: Subject<Map<string, any>>
    let editDialogSubject: Subject<EditDeckDialogResult>
    let deleteDialogSubject: Subject<DeleteDeckDialogResult>
    let databaseServiceMock: DatabaseService
    let component: DeckCardComponent

    beforeEach(async(() => {
      errorMessages = []
      deckInfoActions = new DeckInfoActions()
      cardActions = new CardActions()
      isLoadingSubject = new Subject<boolean>()
      nameSubject = new Subject<string>()
      descriptionSubject = new Subject<string>()
      cardsSubject = new Subject<Map<string, any>>()
      editDialogSubject = new Subject<EditDeckDialogResult>()
      deleteDialogSubject = new Subject<DeleteDeckDialogResult>()
      store = configureMockStore(undefined, {
        editDeck: Map<string, any>({
          name: 'myName',
          description: 'myDescription',
        })
      })
      databaseServiceMock = mock(DatabaseServiceImplementation)
      const logServiceMock = mock(LogServiceImplementation)
      const ngReduxMock = mock(NgReduxExtension)
      const editDialogRefMock = mock(MdDialogRef)
      const deleteDialogRefMock = mock(MdDialogRef)
      const dialogMock = mock(MdDialog)

      when(databaseServiceMock.updateDeckInfo(anything(), anything(), anything()))
        .thenReturn(Promise.resolve())
      when(databaseServiceMock.deleteDeck(anything()))
        .thenReturn(Promise.resolve([]))

      when(logServiceMock.error(anything())).thenCall(message => errorMessages.push(message))

      when(ngReduxMock.dispatch(anything())).thenCall(action => store.dispatch(action))
      when(ngReduxMock.getState()).thenReturn(store.getState())
      when(ngReduxMock.select(deepEqual(['deckInfo', 'myDeckId', 'isLoading'])))
        .thenReturn(isLoadingSubject)
      when(ngReduxMock.select(deepEqual(['deckInfo', 'myDeckId', 'data', 'name'])))
        .thenReturn(nameSubject)
      when(ngReduxMock.select(deepEqual(['deckInfo', 'myDeckId', 'data', 'description'])))
        .thenReturn(descriptionSubject)
      when(ngReduxMock.select(deepEqual(['card', 'myDeckId'])))
        .thenReturn(cardsSubject)

      when(editDialogRefMock.afterClosed()).thenReturn(editDialogSubject)
      when(deleteDialogRefMock.afterClosed()).thenReturn(deleteDialogSubject)
      when(dialogMock.open(EditDeckDialogComponent, anything())).thenReturn(instance(editDialogRefMock))
      when(dialogMock.open(DeleteDeckDialogComponent, anything())).thenReturn(instance(deleteDialogRefMock))

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
          { provide: DeckInfoActions, useValue: deckInfoActions },
          { provide: CardActions, useValue: cardActions },
          { provide: MdDialog, useValue: instance(dialogMock) },
        ],
      }

      TestBed.configureTestingModule(testModuleConfig).compileComponents()

      const fixture = TestBed.createComponent(DeckCardComponent)
      component = fixture.debugElement.componentInstance
    }))

    describe('main component', () => {
      it('should initialize without errors', async(() => {
        expectEqual(errorMessages, [])
        expect(component).toBeTruthy()
      }))

      it('should start listening for deck info and deck cards', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
        ])
      }))

      it('should not display the card count if card list is missing data', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        let currentCount: Number
        const subscription = component.count$.subscribe(count => currentCount = count)

        cardsSubject.next(undefined)
        expect(currentCount).toBeNull()

        cardsSubject.next(Map<string, any>({ isLoading: false }))
        expect(currentCount).toBeNull()

        expectEqual(errorMessages, [])

        subscription.unsubscribe()
      }))

      it('should not display the card count before cards have loaded', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        let currentCount: Number
        const subscription = component.count$.subscribe(count => currentCount = count)
        cardsSubject.next(Map<string, any>({ isLoading: true }))

        expectEqual(errorMessages, [])
        expect(currentCount).toBeNull()

        subscription.unsubscribe()
      }))


      it('should display the number of cards in the deck', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        let currentCount: Number
        const subscription = component.count$.subscribe(count => currentCount = count)
        cardsSubject.next(Map<string, any>({
          isLoading: false,
          data: Map<string, ICard>({
            myCardId1: {},
            myCardId2: {},
          })
        }))

        expectEqual(errorMessages, [])
        expect(currentCount).toEqual(2)

        subscription.unsubscribe()
      }))
    })

    describe('edit deck dialog', () => {
      it('should cancel the edit deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        editDialogSubject.next(EditDeckDialogResult.Cancel)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
          editDeckSetName(null),
          editDeckSetDescription(null),
        ])
        verify(databaseServiceMock.updateDeckInfo(anything(), anything(), anything())).never()
      }))

      it('should save the edit deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        editDialogSubject.next(EditDeckDialogResult.Save)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
          editDeckSetName(null),
          editDeckSetDescription(null),
        ])
        verify(databaseServiceMock.updateDeckInfo(deepEqual(deck), 'myName', 'myDescription')).once()
      }))

      it('should pass deck name and description to the edit deck dialog', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        nameSubject.next('myName2')
        descriptionSubject.next('myDescription2')
        editDialogSubject.next(EditDeckDialogResult.Save)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
          editDeckSetName('myName2'),
          editDeckSetDescription('myDescription2'),
          editDeckSetName(null),
          editDeckSetDescription(null),
        ])
      }))

      it('should catch and log edit deck dialog errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        editDialogSubject.error(new Error('myError'))

        expectEqual(errorMessages, ['myError'])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
          // TODO: editDeckError('myError'),
        ])
        verify(databaseServiceMock.updateDeckInfo(anything(), anything(), anything())).never()
      }))

      it('should throw an error on unexpected edit deck dialog result', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        editDialogSubject.next(42)

        expectEqual(errorMessages, ['Unknown dialog response: 42'])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
          editDeckSetName(null),
          editDeckSetDescription(null),
          // TODO: editDeckError('myError'),
        ])
        verify(databaseServiceMock.updateDeckInfo(anything(), anything(), anything())).never()
      }))

      it('should unsubscribe from observables on edit deck success', async (done) => {
        const deck = updateDeck(component, 'myDeckId')

        const { subscription, complete } = component.onEdit()

        editDialogSubject.next(EditDeckDialogResult.Save)

        await complete

        expectEqual(errorMessages, [])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on edit deck failure', async (done) => {
        const deck = updateDeck(component, 'myDeckId')
        const { subscription, complete } = component.onEdit()

        editDialogSubject.error(new Error('myError'))

        await complete

        expectEqual(errorMessages, ['myError'])
        expect(subscription.closed).toEqual(true)

        done()
      })
    })

    describe('delete deck dialog', () => {
      it('should cancel the delete deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.next(DeleteDeckDialogResult.Cancel)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
        ])
        verify(databaseServiceMock.deleteDeck(anything())).never()
      }))

      it('should save the delete deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.next(DeleteDeckDialogResult.Ok)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
        ])
        verify(databaseServiceMock.deleteDeck(deepEqual(deck))).once()
      }))

      it('should catch and log delete deck dialog errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.error(new Error('myError'))

        expectEqual(errorMessages, ['myError'])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
          // TODO: deleteDeckError('myError'),
        ])
        verify(databaseServiceMock.deleteDeck(anything())).never()
      }))

      it('should throw an error on unexpected delete deck dialog result', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.next(42)

        expectEqual(errorMessages, ['Unknown dialog response: 42'])
        expectEqual(store.getActions(), [
          deckInfoActions.beforeStartListening(deck),
          cardActions.beforeStartListening(deck),
          // TODO: deleteDeckError('myError'),
        ])
        verify(databaseServiceMock.deleteDeck(anything())).never()
      }))

      it('should unsubscribe from observables on delete deck success', async (done) => {
        const deck = updateDeck(component, 'myDeckId')
        const { subscription, complete } = component.onDelete()

        deleteDialogSubject.next(DeleteDeckDialogResult.Ok)

        await complete

        expectEqual(errorMessages, [])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on delete deck failure', async (done) => {
        const deck = updateDeck(component, 'myDeckId')
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
