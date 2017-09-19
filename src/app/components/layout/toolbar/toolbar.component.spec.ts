import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { ToolbarComponent } from './toolbar.component'

describe('components', () => {
  describe('ToolbarComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(ToolbarComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
