import { TestBed, async } from '@angular/core/testing'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { SidenavComponent } from './sidenav.component'

describe('components', () => {
  describe('SidenavComponent', () => {
    let testBed: CardinalTestBed
    let component: SidenavComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(SidenavComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))
  })
})
