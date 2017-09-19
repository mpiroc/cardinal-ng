import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { SidenavComponent } from './sidenav.component'

describe('components', () => {
  describe('SidenavComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(SidenavComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
