import { TestBed, async } from '@angular/core/testing'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { RootComponent } from './root.component'

describe('components', () => {
  describe('RootComponent', () => {
    let testBed: CardinalTestBed
    let component: RootComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(RootComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))
  })
})
