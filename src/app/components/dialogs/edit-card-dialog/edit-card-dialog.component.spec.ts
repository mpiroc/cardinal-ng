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

import { ICard } from '../../../interfaces/firebase'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import {
  EditCardDialogComponent,
  EditCardDialogResult,
} from './edit-card-dialog.component'
import {
  editCardSetFront,
  editCardSetBack,
} from '../../../redux/actions/edit-card'

class SaveHandler {
  handleSave(front: string, back: string): Promise<void> {
    return null;
  }
}

describe('components', () => {
  describe('EditCardDialogComponent', () => {
    let testBed: CardinalTestBed
    let component: EditCardDialogComponent
    let card: ICard
    let frontSubject: Subject<string>
    let backSubject: Subject<string>
    let dialogSubject: Subject<EditCardDialogResult>
    let saveHandlerMock: SaveHandler
    let saveHandler: SaveHandler

    beforeEach(async(() => {
      testBed = new CardinalTestBed({
        editCard: Map<string, any>({
          front: 'myFront',
          back: 'myBack',
        })
      })

      dialogSubject = new Subject<EditCardDialogResult>()
      const dialogRefMock = mock(MdDialogRef)
      when(dialogRefMock.afterClosed()).thenReturn(dialogSubject)

      frontSubject = testBed.whenSelect(['editCard', 'front'])
      backSubject = testBed.whenSelect(['editCard', 'back'])

      saveHandlerMock = mock(SaveHandler)
      when(saveHandlerMock.handleSave(
        anything(),
        anything(),
      )).thenReturn(Promise.resolve())
      saveHandler = instance(saveHandlerMock)

      card = {
        uid: undefined,
        deckId: undefined,
        cardId: 'myCardId',
      }

      testBed.configure([
        { provide: MdDialogRef, useValue: instance(dialogRefMock) },
        {
          provide: MD_DIALOG_DATA, useValue: {
            card,
            front$: frontSubject,
            back$: backSubject,
          }
        },
      ])

      const fixture = TestBed.createComponent(EditCardDialogComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))

    it('should propogate changes to the store', async(() => {
      component.onFrontInput({
        target: { value: 'myFront' }
      })
      component.onBackInput({
        target: { value: 'myBack' }
      })

      testBed.expectActions([
        editCardSetFront('myFront'),
        editCardSetBack('myBack'),
      ])
    }))

    it('should cancel the edit card dialog without errors', async(() => {
      component.getResult(saveHandler.handleSave)

      dialogSubject.next(EditCardDialogResult.Cancel)

      testBed.expectErrors([])
      testBed.expectActions([
        editCardSetFront(null),
        editCardSetBack(null),
      ])
      verify(saveHandlerMock.handleSave(
        anything(),
        anything(),
      )).never()
    }))

    it('should save the edit card dialog without errors', async(() => {
      component.getResult(saveHandler.handleSave)

      dialogSubject.next(EditCardDialogResult.Save)

      testBed.expectErrors([])
      testBed.expectActions([
        editCardSetFront(null),
        editCardSetBack(null),
      ])
      verify(saveHandlerMock.handleSave(
        'myFront',
        'myBack',
      )).once()
    }))

    it('should pass card front and back to the edit card dialog', async(() => {
      component.getResult(saveHandler.handleSave)

      frontSubject.next('myFront2')
      backSubject.next('myBack2')
      dialogSubject.next(EditCardDialogResult.Save)

      testBed.expectErrors([])
      testBed.expectActions([
        editCardSetFront('myFront2'),
        editCardSetBack('myBack2'),
        editCardSetFront(null),
        editCardSetBack(null),
      ])
    }))

    it('should catch and log edit card dialog errors', async(() => {
      component.getResult(saveHandler.handleSave)

      dialogSubject.error(new Error('myError'))

      testBed.expectErrors(['myError'])
      testBed.expectActions([
        // TODO: editCardError('myError'),
      ])
    }))

    it('should throw an error on unexpected card deck dialog result', async(() => {
      component.getResult(saveHandler.handleSave)

      dialogSubject.next(42)
      testBed.expectErrors(['Unknown dialog response: 42'])
      testBed.expectActions([
        editCardSetFront(null),
        editCardSetBack(null),
      ])
    }))

    it('should unsubscribe from observables on edit card success', async (done) => {
      const { subscription, complete } = component.getResult(saveHandler.handleSave)

      dialogSubject.next(EditCardDialogResult.Save)

      await complete

      testBed.expectErrors([])
      expect(subscription.closed).toEqual(true)

      done()
    })

    it('should unsubscribe from observables on edit card failure', async (done) => {
      const { subscription, complete } = component.getResult(saveHandler.handleSave)

      dialogSubject.error(new Error('myError'))

      await complete

      testBed.expectErrors(['myError'])
      expect(subscription.closed).toEqual(true)

      done()
    })
  })
})
