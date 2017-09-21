import { TestBed, async } from '@angular/core/testing'
import { Map } from 'immutable'
import { Subject } from 'rxjs/Subject'
import {
  instance,
  mock,
  when,
  verify,
  deepEqual,
  anything,
} from 'ts-mockito'

import { CardinalTestBed } from '../../../utils/cardinal-test-bed'
import { updateComponent } from '../../../utils/test-utils.spec'
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../../redux/actions/edit-deck'
import { EditDeckDialogComponent, EditDeckDialogResult } from '../../dialogs/edit-deck-dialog/edit-deck-dialog.component'
import { DeleteDeckDialogComponent, DeleteDeckDialogResult } from '../../dialogs/delete-deck-dialog/delete-deck-dialog.component'
import { DeckCardComponent } from './deck-card.component'

function updateDeck(component: DeckCardComponent, deckId: string) {
  return updateComponent(component, 'deck', {
    uid: undefined,
    deckId,
  })
}

describe('components', () => {
  describe('DeckCardComponent', () => {
    let testBed: CardinalTestBed
    let isLoadingSubject: Subject<boolean>
    let nameSubject: Subject<string>
    let descriptionSubject: Subject<string>
    let cardsSubject: Subject<Map<string, any>>
    let editDialogSubject: Subject<EditDeckDialogResult>
    let deleteDialogSubject: Subject<DeleteDeckDialogResult>
    let component: DeckCardComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed({
        editDeck: Map<string, any>({
          name: 'myName',
          description: 'myDescription',
        })
      })

      when(testBed.databaseServiceMock.updateDeckInfo(
        anything(),
        anything(),
        anything(),
      )).thenReturn(Promise.resolve())
      when(testBed.databaseServiceMock.deleteDeck(anything()))
        .thenReturn(Promise.resolve([]))

      isLoadingSubject = testBed.whenSelect(['deckInfo', 'myDeckId', 'isLoading'])
      nameSubject = testBed.whenSelect(['deckInfo', 'myDeckId', 'data', 'name'])
      descriptionSubject = testBed.whenSelect(['deckInfo', 'myDeckId', 'data', 'description'])
      cardsSubject = testBed.whenSelect(['card', 'myDeckId'])

      editDialogSubject = testBed.whenOpenDialog(EditDeckDialogComponent)
      deleteDialogSubject = testBed.whenOpenDialog(DeleteDeckDialogComponent)

      testBed.configure()

      const fixture = TestBed.createComponent(DeckCardComponent)
      component = fixture.debugElement.componentInstance
    }))

    describe('main component', () => {
      it('should initialize without errors', async(() => {
        testBed.expectErrors([])
        expect(component).toBeTruthy()
      }))

      it('should start listening for deck info and deck cards', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
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

        testBed.expectErrors([])

        subscription.unsubscribe()
      }))

      it('should not display the card count before cards have loaded', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        let currentCount: Number
        const subscription = component.count$.subscribe(count => currentCount = count)
        cardsSubject.next(Map<string, any>({ isLoading: true }))

        testBed.expectErrors([])
        expect(currentCount).toBeNull()

        subscription.unsubscribe()
      }))


      it('should display the number of cards in the deck', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        let currentCount: Number
        const subscription = component.count$.subscribe(count => currentCount = count)
        cardsSubject.next(Map<string, any>({
          isLoading: false,
          data: Map<string, any>({
            myCardId1: {},
            myCardId2: {},
          })
        }))

        testBed.expectErrors([])
        expect(currentCount).toEqual(2)

        subscription.unsubscribe()
      }))
    })

    describe('edit deck dialog', () => {
      it('should cancel the edit deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        editDialogSubject.next(EditDeckDialogResult.Cancel)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
          editDeckSetName(null),
          editDeckSetDescription(null),
        ])
        verify(testBed.databaseServiceMock.updateDeckInfo(
          anything(),
          anything(),
          anything(),
        )).never()
      }))

      it('should save the edit deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        editDialogSubject.next(EditDeckDialogResult.Save)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
          editDeckSetName(null),
          editDeckSetDescription(null),
        ])
        verify(testBed.databaseServiceMock.updateDeckInfo(
          deepEqual(deck),
          'myName',
          'myDescription',
        )).once()
      }))

      it('should pass deck name and description to the edit deck dialog', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        nameSubject.next('myName2')
        descriptionSubject.next('myDescription2')
        editDialogSubject.next(EditDeckDialogResult.Save)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
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

        testBed.expectErrors(['myError'])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
          // TODO: editDeckError('myError'),
        ])
        verify(testBed.databaseServiceMock.updateDeckInfo(anything(), anything(), anything())).never()
      }))

      it('should throw an error on unexpected edit deck dialog result', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onEdit()

        editDialogSubject.next(42)

        testBed.expectErrors(['Unknown dialog response: 42'])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
          editDeckSetName(null),
          editDeckSetDescription(null),
          // TODO: editDeckError('myError'),
        ])
        verify(testBed.databaseServiceMock.updateDeckInfo(anything(), anything(), anything())).never()
      }))

      it('should unsubscribe from observables on edit deck success', async (done) => {
        const deck = updateDeck(component, 'myDeckId')

        const { subscription, complete } = component.onEdit()

        editDialogSubject.next(EditDeckDialogResult.Save)

        await complete

        testBed.expectErrors([])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on edit deck failure', async (done) => {
        const deck = updateDeck(component, 'myDeckId')
        const { subscription, complete } = component.onEdit()

        editDialogSubject.error(new Error('myError'))

        await complete

        testBed.expectErrors(['myError'])
        expect(subscription.closed).toEqual(true)

        done()
      })
    })

    describe('delete deck dialog', () => {
      it('should cancel the delete deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.next(DeleteDeckDialogResult.Cancel)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
        ])
        verify(testBed.databaseServiceMock.deleteDeck(anything())).never()
      }))

      it('should save the delete deck dialog without errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.next(DeleteDeckDialogResult.Ok)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
        ])
        verify(testBed.databaseServiceMock.deleteDeck(deepEqual(deck))).once()
      }))

      it('should catch and log delete deck dialog errors', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.error(new Error('myError'))

        testBed.expectErrors(['myError'])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
          // TODO: deleteDeckError('myError'),
        ])
        verify(testBed.databaseServiceMock.deleteDeck(anything())).never()
      }))

      it('should throw an error on unexpected delete deck dialog result', async(() => {
        const deck = updateDeck(component, 'myDeckId')

        component.onDelete()

        deleteDialogSubject.next(42)

        testBed.expectErrors(['Unknown dialog response: 42'])
        testBed.expectActions([
          testBed.deckInfoActions.beforeStartListening(deck),
          testBed.cardActions.beforeStartListening(deck),
          // TODO: deleteDeckError('myError'),
        ])
        verify(testBed.databaseServiceMock.deleteDeck(anything())).never()
      }))

      it('should unsubscribe from observables on delete deck success', async (done) => {
        const deck = updateDeck(component, 'myDeckId')
        const { subscription, complete } = component.onDelete()

        deleteDialogSubject.next(DeleteDeckDialogResult.Ok)

        await complete

        testBed.expectErrors([])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on delete deck failure', async (done) => {
        const deck = updateDeck(component, 'myDeckId')
        const { subscription, complete } = component.onDelete()

        deleteDialogSubject.error(new Error('myError'))

        await complete

        testBed.expectErrors(['myError'])
        expect(subscription.closed).toEqual(true)

        done()
      })
    })
  })
})
