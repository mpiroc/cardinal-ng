import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { RootComponent } from './root.component'

describe('components', () => {
  describe('RootComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(RootComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
