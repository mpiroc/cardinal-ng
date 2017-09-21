import { TestBed, async } from '@angular/core/testing'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { ReviewDeckRouteComponent } from './review-deck-route.component'

describe('components', () => {
  describe('ReviewDeckRouteComponent', () => {
    let testBed: CardinalTestBed
    let component: ReviewDeckRouteComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(ReviewDeckRouteComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))
  })
})
