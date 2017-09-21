import { TestBed, async } from '@angular/core/testing'
import { MdDialogRef } from '@angular/material'
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

import { ICard } from '../../../interfaces/firebase'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import {
  DeleteCardDialogComponent,
  DeleteCardDialogResult,
} from './delete-card-dialog.component'

describe('components', () => {
  describe('DeleteCardDialogComponent', () => {
    let testBed: CardinalTestBed
    let component: DeleteCardDialogComponent
    let card: ICard
    let dialogSubject: Subject<DeleteCardDialogResult>

    beforeEach(async(() => {
      testBed = new CardinalTestBed()

      dialogSubject = new Subject<DeleteCardDialogResult>()
      const dialogRefMock = mock(MdDialogRef)
      when(dialogRefMock.afterClosed()).thenReturn(dialogSubject)

      when(testBed.databaseServiceMock.deleteCard(anything()))
        .thenReturn(Promise.resolve([]))

      card = {
        uid: undefined,
        deckId: undefined,
        cardId: 'myCardId',
      }

      testBed.configure([
        { provide: MdDialogRef, useValue: instance(dialogRefMock) },
      ])

      const fixture = TestBed.createComponent(DeleteCardDialogComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))

    it('should cancel the delete card dialog without errors', async(() => {
      component.getResult(card)

      dialogSubject.next(DeleteCardDialogResult.Cancel)

      testBed.expectErrors([])
      testBed.expectActions([])
      verify(testBed.databaseServiceMock.deleteCard(anything())).never()
    }))

    it('should save the delete card dialog without errors', async(() => {
      component.getResult(card)

      dialogSubject.next(DeleteCardDialogResult.Ok)

      testBed.expectErrors([])
      testBed.expectActions([])
      verify(testBed.databaseServiceMock.deleteCard(deepEqual(card))).once()
    }))

    it('should catch and log delete card dialog errors', async(() => {
      component.getResult(card)

      dialogSubject.error(new Error('myError'))

      testBed.expectErrors(['myError'])
      testBed.expectActions([
        // TODO: deleteCardError('myError'),
      ])
    }))

    it('should throw an error on unexpected delete card dialog result', async(() => {
      component.getResult(card)

      dialogSubject.next(42)
      testBed.expectErrors(['Unknown dialog response: 42'])
      testBed.expectActions([
        // TODO: deleteDialogError('Unknown dialog response: 42'),
      ])
    }))

    it('should unsubscribe from observables on delete card success', async (done) => {
      const { subscription, complete } = component.getResult(card)

      dialogSubject.next(DeleteCardDialogResult.Ok)

      await complete

      testBed.expectErrors([])
      expect(subscription.closed).toEqual(true)

      done()
    })

    it('should unsubscribe from observables on delete card failure', async (done) => {
      const { subscription, complete } = component.getResult(card)

      dialogSubject.error(new Error('myError'))

      await complete

      testBed.expectErrors(['myError'])
      expect(subscription.closed).toEqual(true)

      done()
    })
  })
})
