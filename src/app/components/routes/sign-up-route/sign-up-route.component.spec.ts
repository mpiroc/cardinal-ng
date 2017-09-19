import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { SignUpRouteComponent } from './sign-up-route.component'

describe('components', () => {
  describe('SignUpRouteComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(SignUpRouteComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
