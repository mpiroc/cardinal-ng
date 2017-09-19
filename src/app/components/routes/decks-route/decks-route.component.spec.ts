import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { DecksRouteComponent } from './decks-route.component'

describe('components', () => {
  describe('DecksRouteComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(DecksRouteComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
