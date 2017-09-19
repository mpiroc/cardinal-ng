import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { SignInRouteComponent } from './sign-in-route.component'

describe('components', () => {
  describe('SignInRouteComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(SignInRouteComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
