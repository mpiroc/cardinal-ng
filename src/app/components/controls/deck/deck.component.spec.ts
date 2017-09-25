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

import {
  updateComponent,
  CardinalTestBed,
} from '../../../utils/component-test-utils.spec'
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../../redux/actions/edit-deck'
import { EditDeckDialogComponent, EditDeckDialogResult } from '../../dialogs/edit-deck-dialog/edit-deck-dialog.component'
import { DeleteDeckDialogComponent, DeleteDeckDialogResult } from '../../dialogs/delete-deck-dialog/delete-deck-dialog.component'
import { DeckComponent } from './deck.component'

function updateDeck(component: DeckComponent, deckId: string) {
  return updateComponent(component, 'deck', {
    uid: undefined,
    deckId,
  })
}

describe('components', () => {
  describe('DeckComponent', () => {
    let testBed: CardinalTestBed
    let isLoadingSubject: Subject<boolean>
    let nameSubject: Subject<string>
    let descriptionSubject: Subject<string>
    let cardsSubject: Subject<Map<string, any>>
    let editDialogSubject: Subject<EditDeckDialogResult>
    let deleteDialogSubject: Subject<DeleteDeckDialogResult>
    let component: DeckComponent

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

      const fixture = TestBed.createComponent(DeckComponent)
      component = fixture.debugElement.componentInstance
    }))

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

    it('should not display the total card count if card list is missing data', async(() => {
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

    it('should not display the total card count before cards have loaded', async(() => {
      const deck = updateDeck(component, 'myDeckId')

      let currentCount: Number
      const subscription = component.count$.subscribe(count => currentCount = count)
      cardsSubject.next(Map<string, any>({ isLoading: true }))

      testBed.expectErrors([])
      expect(currentCount).toBeNull()

      subscription.unsubscribe()
    }))

    it('should display the total number of cards in the deck', async(() => {
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

    it('should should listening for card histories')
    it('should display the number of due cards in the deck')
    it('should not display the number of total cards before the number of due cards has loaded')
  })
})
