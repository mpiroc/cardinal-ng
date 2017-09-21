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
} from '../../../utils/component-test-utils'
import {
  editCardSetFront,
  editCardSetBack,
} from '../../../redux/actions/edit-card'
import { EditCardDialogComponent, EditCardDialogResult } from '../../dialogs/edit-card-dialog/edit-card-dialog.component'
import { DeleteCardDialogComponent, DeleteCardDialogResult } from '../../dialogs/delete-card-dialog/delete-card-dialog.component'
import { CardCardComponent } from './card-card.component'

function updateCard(component: CardCardComponent, cardId: string) {
  return updateComponent(component, 'card', {
    uid: undefined,
    deckId: undefined,
    cardId,
  })
}

describe('components', () => {
  describe('CardCardComponent', () => {
    let testBed: CardinalTestBed

    let isLoadingSubject: Subject<boolean>
    let frontSubject: Subject<string>
    let backSubject: Subject<string>
    let editDialogSubject: Subject<EditCardDialogResult>
    let deleteDialogSubject: Subject<DeleteCardDialogResult>
    let component: CardCardComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed({
        editCard: Map<string, any>({
          front: 'myFront',
          back: 'myBack',
        })
      })

      isLoadingSubject = testBed.whenSelect(['cardContent', 'myCardId', 'isLoading'])
      frontSubject = testBed.whenSelect(['cardContent', 'myCardId', 'data', 'front'])
      backSubject = testBed.whenSelect(['cardContent', 'myCardId', 'data', 'back'])
      editDialogSubject = testBed.whenOpenDialog(EditCardDialogComponent)
      deleteDialogSubject = testBed.whenOpenDialog(DeleteCardDialogComponent)

      when(testBed.databaseServiceMock.updateCardContent(
        anything(),
        anything(),
        anything(),
      )).thenReturn(Promise.resolve())

      when(testBed.databaseServiceMock.deleteCard(anything()))
        .thenReturn(Promise.resolve([]))

      testBed.configure()

      const fixture = TestBed.createComponent(CardCardComponent)
      component = fixture.debugElement.componentInstance
    }))

    describe('main component', () => {
      it('should initialize without errors', async(() => {
        testBed.expectErrors([])
        expect(component).toBeTruthy()
      }))

      it('should start listening for card content', async(() => {
        const card = updateCard(component, 'myCardId')
        isLoadingSubject.next(false)
        frontSubject.next('myFront')
        backSubject.next('myBack')

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card)
        ])
      }))
    })

    describe('edit card dialog', () => {
      it('should cancel the edit card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        editDialogSubject.next(EditCardDialogResult.Cancel)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
          editCardSetFront(null),
          editCardSetBack(null),
        ])
        verify(testBed.databaseServiceMock.updateCardContent(
          anything(),
          anything(),
          anything(),
        )).never()
      }))

      it('should save the edit card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        editDialogSubject.next(EditCardDialogResult.Save)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
          editCardSetFront(null),
          editCardSetBack(null),
        ])
        verify(testBed.databaseServiceMock.updateCardContent(
          deepEqual(card),
          'myFront',
          'myBack',
        )).once()
      }))

      it('should pass card front and back to the edit card dialog', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        frontSubject.next('myFront2')
        backSubject.next('myBack2')
        editDialogSubject.next(EditCardDialogResult.Save)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
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

        testBed.expectErrors(['myError'])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
          // TODO: editCardError('myError'),
        ])
      }))

      it('should throw an error on unexpected card deck dialog result', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onEdit()

        editDialogSubject.next(42)
        testBed.expectErrors(['Unknown dialog response: 42'])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
          editCardSetFront(null),
          editCardSetBack(null),
        ])
      }))

      it('should unsubscribe from observables on edit card success', async (done) => {
        const card = updateCard(component, 'myCardId')
        const { subscription, complete } = component.onEdit()

        editDialogSubject.next(EditCardDialogResult.Save)

        await complete

        testBed.expectErrors([])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on edit card failure', async (done) => {
        const card = updateCard(component, 'myCardId')
        const { subscription, complete } = component.onEdit()

        editDialogSubject.error(new Error('myError'))

        await complete

        testBed.expectErrors(['myError'])
        expect(subscription.closed).toEqual(true)

        done()
      })

    })

    describe('delete card dialog', () => {
      it('should cancel the delete card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.next(DeleteCardDialogResult.Cancel)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
        ])
        verify(testBed.databaseServiceMock.deleteCard(anything())).never()
      }))

      it('should save the delete card dialog without errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.next(DeleteCardDialogResult.Ok)

        testBed.expectErrors([])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
        ])
        verify(testBed.databaseServiceMock.deleteCard(deepEqual(card))).once()
      }))

      it('should catch and log delete card dialog errors', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.error(new Error('myError'))

        testBed.expectErrors(['myError'])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
          // TODO: deleteCardError('myError'),
        ])
      }))

      it('should throw an error on unexpected delete card dialog result', async(() => {
        const card = updateCard(component, 'myCardId')
        component.onDelete()

        deleteDialogSubject.next(42)
        testBed.expectErrors(['Unknown dialog response: 42'])
        testBed.expectActions([
          testBed.cardContentActions.beforeStartListening(card),
          // TODO: deleteDialogError('Unknown dialog response: 42'),
        ])
      }))

      it('should unsubscribe from observables on delete card success', async (done) => {
        const card = updateCard(component, 'myCardId')
        const { subscription, complete } = component.onDelete()

        deleteDialogSubject.next(DeleteCardDialogResult.Ok)

        await complete

        testBed.expectErrors([])
        expect(subscription.closed).toEqual(true)

        done()
      })

      it('should unsubscribe from observables on delete card failure', async (done) => {
        const card = updateCard(component, 'myCardId')
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
