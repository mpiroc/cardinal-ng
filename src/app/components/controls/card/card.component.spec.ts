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
import { CardComponent } from './card.component'

function updateCard(component: CardComponent, cardId: string) {
  return updateComponent(component, 'card', {
    uid: undefined,
    deckId: undefined,
    cardId,
  })
}

describe('components', () => {
  describe('CardComponent', () => {
    let testBed: CardinalTestBed

    let isLoadingSubject: Subject<boolean>
    let frontSubject: Subject<string>
    let backSubject: Subject<string>
    let nextReviewSubject: Subject<number>
    let component: CardComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()

      isLoadingSubject = testBed.whenSelect(['cardContent', 'myCardId', 'isLoading'])
      frontSubject = testBed.whenSelect(['cardContent', 'myCardId', 'data', 'front'])
      backSubject = testBed.whenSelect(['cardContent', 'myCardId', 'data', 'back'])
      nextReviewSubject = testBed.whenSelect(['cardHistory', 'myCardId', 'data', 'nextReview'])

      testBed.configure()

      const fixture = TestBed.createComponent(CardComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      testBed.expectErrors([])
      expect(component).toBeTruthy()
    }))

    it('should start listening for card content and due date', async(() => {
      const card = updateCard(component, 'myCardId')
      isLoadingSubject.next(false)
      frontSubject.next('myFront')
      backSubject.next('myBack')
      nextReviewSubject.next(0)

      testBed.expectErrors([])
      testBed.expectActions([
        testBed.cardContentActions.beforeStartListening(card),
        testBed.cardHistoryActions.beforeStartListening(card),
      ])
    }))
  })
})
