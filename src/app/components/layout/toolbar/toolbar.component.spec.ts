import { TestBed, async } from '@angular/core/testing'
import { Subject } from 'rxjs/Subject'
import { CardinalTestBed } from '../../../utils/component-test-utils.spec'
import { ToolbarComponent } from './toolbar.component'
import { verify } from 'ts-mockito'

describe('components', () => {
  describe('ToolbarComponent', () => {
    let testBed: CardinalTestBed
    let component: ToolbarComponent
    let isLoadingSubject: Subject<boolean>

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      isLoadingSubject = testBed.whenSelect(['user', 'isLoading'])
      testBed.configure()

      const fixture = TestBed.createComponent(ToolbarComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))

    it('should respond to user isLoading changes', async(() => {
      component.ngOnInit()

      let currentIsLoading: boolean
      const subscription = component.isLoading$
        .subscribe(isLoading => currentIsLoading = isLoading)

      isLoadingSubject.next(false)

      subscription.unsubscribe()

      expect(currentIsLoading).toEqual(false)
    }))

    it('should sign out via the auth service', async(() => {
      component.onSignOut()

      verify(testBed.authServiceMock.signOut()).once()
    }))
  })
})
