import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { ResetPasswordRouteComponent } from './reset-password-route.component'

describe('components', () => {
  describe('ResetPasswordRouteComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(ResetPasswordRouteComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
