import { TestBed, async } from '@angular/core/testing'
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { Map } from 'immutable'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import {
  instance,
  mock,
  when,
  verify,
  deepEqual,
  anything,
} from 'ts-mockito'

import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import {
  DeleteDeckDialogComponent,
  DeleteDeckDialogResult,
} from './delete-deck-dialog.component'
import { IDeck } from '../../../interfaces/firebase'

describe('components', () => {
  describe('DeleteDeckDialogComponent', () => {
    let testBed: CardinalTestBed
    let component: DeleteDeckDialogComponent
    let deck: IDeck
    let dialogSubject: Subject<DeleteDeckDialogResult>

    beforeEach(async(() => {
      testBed = new CardinalTestBed()

      dialogSubject = new Subject<DeleteDeckDialogResult>()
      const dialogRefMock = mock(MdDialogRef)
      when(dialogRefMock.afterClosed()).thenReturn(dialogSubject)

      when(testBed.databaseServiceMock.deleteDeck(anything()))
        .thenReturn(Promise.resolve([]))

      deck = {
        uid: undefined,
        deckId: 'myDeckID',
      }

      testBed.configure([
        { provide: MdDialogRef, useValue: instance(dialogRefMock) },
        { provide: MD_DIALOG_DATA, useValue: {
            name$: Observable.of('myName')
          }
        }
      ])

      const fixture = TestBed.createComponent(DeleteDeckDialogComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))

    it('should cancel the delete deck dialog without errors', async(() => {
      component.getResult(deck)

      dialogSubject.next(DeleteDeckDialogResult.Cancel)

      testBed.expectErrors([])
      testBed.expectActions([])
      verify(testBed.databaseServiceMock.deleteDeck(anything())).never()
    }))

    it('should save the delete deck dialog without errors', async(() => {
      component.getResult(deck)

      dialogSubject.next(DeleteDeckDialogResult.Ok)

      testBed.expectErrors([])
      testBed.expectActions([])
      verify(testBed.databaseServiceMock.deleteDeck(deepEqual(deck))).once()
    }))

    it('should catch and log delete deck dialog errors', async(() => {
      component.getResult(deck)

      dialogSubject.error(new Error('myError'))

      testBed.expectErrors(['myError'])
      testBed.expectActions([
        // TODO: deleteDeckError('myError'),
      ])
      verify(testBed.databaseServiceMock.deleteDeck(anything())).never()
    }))

    it('should throw an error on unexpected delete deck dialog result', async(() => {
      component.getResult(deck)

      dialogSubject.next(42)

      testBed.expectErrors(['Unknown dialog response: 42'])
      testBed.expectActions([
        // TODO: deleteDeckError('myError'),
      ])
      verify(testBed.databaseServiceMock.deleteDeck(anything())).never()
    }))

    it('should unsubscribe from observables on delete deck success', async (done) => {
      const { subscription, complete } = component.getResult(deck)

      dialogSubject.next(DeleteDeckDialogResult.Ok)

      await complete

      testBed.expectErrors([])
      expect(subscription.closed).toEqual(true)

      done()
    })

    it('should unsubscribe from observables on delete deck failure', async (done) => {
      const { subscription, complete } = component.getResult(deck)

      dialogSubject.error(new Error('myError'))

      await complete

      testBed.expectErrors(['myError'])
      expect(subscription.closed).toEqual(true)

      done()
    })
  })
})
