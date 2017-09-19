import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { LoadingSpinnerComponent } from './loading-spinner.component'

describe('components', () => {
  describe('LoadingSpinnerComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(LoadingSpinnerComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
