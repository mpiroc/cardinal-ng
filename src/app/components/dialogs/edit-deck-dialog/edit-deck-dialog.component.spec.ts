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

import { IDeck } from '../../../interfaces/firebase'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import {
  EditDeckDialogComponent,
  EditDeckDialogResult,
} from './edit-deck-dialog.component'
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../../redux/actions/edit-deck'

class SaveHandler {
  handleSave(name: string, description: string): Promise<void> {
    return null;
  }
}

describe('components', () => {
  describe('EditCardDialogComponent', () => {
    let testBed: CardinalTestBed
    let component: EditDeckDialogComponent
    let deck: IDeck
    let nameSubject: Subject<string>
    let descriptionSubject: Subject<string>
    let dialogSubject: Subject<EditDeckDialogResult>
    let saveHandlerMock: SaveHandler
    let saveHandler: SaveHandler

    beforeEach(async(() => {
      testBed = new CardinalTestBed({
        editDeck: Map<string, any>({
          name: 'myName',
          description: 'myDescription',
        })
      })

      dialogSubject = new Subject<EditDeckDialogResult>()
      const dialogRefMock = mock(MdDialogRef)
      when(dialogRefMock.afterClosed()).thenReturn(dialogSubject)

      nameSubject = testBed.whenSelect(['editDeck', 'name'])
      descriptionSubject = testBed.whenSelect(['editDeck', 'description'])

      saveHandlerMock = mock(SaveHandler)
      when(saveHandlerMock.handleSave(
        anything(),
        anything(),
      )).thenReturn(Promise.resolve())
      saveHandler = instance(saveHandlerMock)

      deck = {
        uid: undefined,
        deckId: 'myDeckId',
      }

      testBed.configure([
        { provide: MdDialogRef, useValue: instance(dialogRefMock) },
        {
          provide: MD_DIALOG_DATA, useValue: {
            deck,
            name$: nameSubject,
            description$: descriptionSubject,
          }
        },
      ])

      const fixture = TestBed.createComponent(EditDeckDialogComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))

    it('should propogate changes to the store', async(() => {
      component.onNameInput({
        target: { value: 'myName' }
      })
      component.onDescriptionInput({
        target: { value: 'myDescription' }
      })

      testBed.expectActions([
        editDeckSetName('myName'),
        editDeckSetDescription('myDescription'),
      ])
    }))

    it('should cancel the edit deck dialog without errors', async(() => {
      component.getResult(saveHandler.handleSave)

      dialogSubject.next(EditDeckDialogResult.Cancel)

      testBed.expectErrors([])
      testBed.expectActions([
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
      component.getResult(saveHandler.handleSave)

      dialogSubject.next(EditDeckDialogResult.Save)

      testBed.expectErrors([])
      testBed.expectActions([
        editDeckSetName(null),
        editDeckSetDescription(null),
      ])
      verify(saveHandlerMock.handleSave(
        'myName',
        'myDescription',
      )).once()
    }))

    it('should pass deck name and description to the edit deck dialog', async(() => {
      component.getResult(saveHandler.handleSave)

      nameSubject.next('myName2')
      descriptionSubject.next('myDescription2')
      dialogSubject.next(EditDeckDialogResult.Save)

      testBed.expectErrors([])
      testBed.expectActions([
        editDeckSetName('myName2'),
        editDeckSetDescription('myDescription2'),
        editDeckSetName(null),
        editDeckSetDescription(null),
      ])
    }))

    it('should catch and log edit deck dialog errors', async(() => {
      component.getResult(saveHandler.handleSave)

      dialogSubject.error(new Error('myError'))

      testBed.expectErrors(['myError'])
      testBed.expectActions([
        // TODO: editDeckError('myError'),
      ])
      verify(testBed.databaseServiceMock.updateDeckInfo(anything(), anything(), anything())).never()
    }))

    it('should throw an error on unexpected edit deck dialog result', async(() => {
      component.getResult(saveHandler.handleSave)

      dialogSubject.next(42)

      testBed.expectErrors(['Unknown dialog response: 42'])
      testBed.expectActions([
        editDeckSetName(null),
        editDeckSetDescription(null),
        // TODO: editDeckError('myError'),
      ])
      verify(testBed.databaseServiceMock.updateDeckInfo(anything(), anything(), anything())).never()
    }))

    it('should unsubscribe from observables on edit deck success', async (done) => {
      const { subscription, complete } = component.getResult(saveHandler.handleSave)

      dialogSubject.next(EditDeckDialogResult.Save)

      await complete

      testBed.expectErrors([])
      expect(subscription.closed).toEqual(true)

      done()
    })

    it('should unsubscribe from observables on edit deck failure', async (done) => {
      const { subscription, complete } = component.getResult(saveHandler.handleSave)

      dialogSubject.error(new Error('myError'))

      await complete

      testBed.expectErrors(['myError'])
      expect(subscription.closed).toEqual(true)

      done()
    })
  })
})
