import { TestBed, async } from '@angular/core/testing'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { DecksRouteComponent } from './decks-route.component'

describe('components', () => {
  describe('DecksRouteComponent', () => {
    let testBed: CardinalTestBed
    let component: DecksRouteComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(DecksRouteComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))
  })
})
