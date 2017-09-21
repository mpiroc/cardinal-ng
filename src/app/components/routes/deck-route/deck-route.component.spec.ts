import { TestBed, async } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { Map } from 'immutable'
import { Subject } from 'rxjs/Subject'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { ICard, IDeck } from '../../../interfaces/firebase'
import { DeckRouteComponent } from './deck-route.component'

describe('components', () => {
  describe('DeckRouteComponent', () => {
    let testBed: CardinalTestBed
    let deck: IDeck
    let component: DeckRouteComponent
    let isLoadingSubject: Subject<boolean>
    let cardsSubject: Subject<Map<string, ICard>>

    beforeEach(async(() => {
      deck = {
        uid: undefined,
        deckId: 'myDeckId',
      }

      testBed = new CardinalTestBed()

      isLoadingSubject = testBed.whenSelect(['card', deck.deckId, 'isLoading'])
      cardsSubject = testBed.whenSelect(['card', deck.deckId, 'data'])

      testBed.configure()

      const activatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute)
      activatedRoute.snapshot.data['deck'] = deck

      const fixture = TestBed.createComponent(DeckRouteComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should instantiate without errors', async(() => {
      testBed.expectErrors([])
      expect(component).toBeTruthy()
    }))

    it('should initialize without errors', async(() => {
      component.ngOnInit()

      testBed.expectErrors([])
      testBed.expectActions([
        testBed.cardActions.beforeStartListening(deck)
      ])
    }))
  })
})
