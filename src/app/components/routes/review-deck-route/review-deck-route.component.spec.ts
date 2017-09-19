import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { ReviewDeckRouteComponent } from './review-deck-route.component'

describe('components', () => {
  describe('ReviewDeckRouteComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(ReviewDeckRouteComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
