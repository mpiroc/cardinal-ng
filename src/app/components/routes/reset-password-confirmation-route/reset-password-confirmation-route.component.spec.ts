import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { ResetPasswordConfirmationRouteComponent } from './reset-password-confirmation-route.component'

describe('components', () => {
  describe('ResetPasswordConfirmationRouteComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(ResetPasswordConfirmationRouteComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
