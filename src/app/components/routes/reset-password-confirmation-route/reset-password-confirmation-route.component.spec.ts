import { TestBed, async } from '@angular/core/testing'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import {
  ResetPasswordConfirmationRouteComponent
} from './reset-password-confirmation-route.component'

describe('components', () => {
  describe('ResetPasswordConfirmationRouteComponent', () => {
    let testBed: CardinalTestBed
    let component: ResetPasswordConfirmationRouteComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(ResetPasswordConfirmationRouteComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))
  })
})
