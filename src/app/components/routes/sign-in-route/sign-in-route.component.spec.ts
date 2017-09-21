import { TestBed, async } from '@angular/core/testing'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { SignInRouteComponent } from './sign-in-route.component'

describe('components', () => {
  describe('SignInRouteComponent', () => {
    let testBed: CardinalTestBed
    let component: SignInRouteComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(SignInRouteComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))
  })
})
