import { TestBed, async } from '@angular/core/testing'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { ResetPasswordRouteComponent } from './reset-password-route.component'

describe('components', () => {
  describe('ResetPasswordRouteComponent', () => {
    let testBed: CardinalTestBed
    let component: ResetPasswordRouteComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(ResetPasswordRouteComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))
  })
})
