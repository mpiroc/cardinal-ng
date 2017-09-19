import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { DeckRouteComponent } from './deck-route.component'

describe('components', () => {
  describe('DeckRouteComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(DeckRouteComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
