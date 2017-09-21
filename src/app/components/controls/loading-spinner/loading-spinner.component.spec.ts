import { TestBed, async } from '@angular/core/testing'
import { Map } from 'immutable'
import { Subject } from 'rxjs/Subject'
import {
  instance,
  mock,
  when,
  verify,
  deepEqual,
  anything,
} from 'ts-mockito'

import { CardinalTestBed } from '../../../utils/cardinal-test-bed'
import { updateComponent } from '../../../utils/test-utils.spec'
import { LoadingSpinnerComponent } from './loading-spinner.component'

function updateIsLoading(component: LoadingSpinnerComponent): Subject<boolean> {
  return updateComponent(component, 'isLoading$', new Subject<boolean>())
}

describe('components', () => {
  describe('LoadingSpinnerComponent', () => {
    let testBed: CardinalTestBed
    let component: LoadingSpinnerComponent

    beforeEach(async(() => {
      testBed = new CardinalTestBed()
      testBed.configure()

      const fixture = TestBed.createComponent(LoadingSpinnerComponent)
      component = fixture.debugElement.componentInstance
    }))

    it('should initialize without errors', async(() => {
      expect(component).toBeTruthy()
    }))

    it('should update isLoading$ immediately', async(() => {
      const isLoadingSubject = updateIsLoading(component)

      let currentIsLoading: boolean
      const subscription = component.isLoading$.subscribe(isLoading => currentIsLoading = isLoading)

      isLoadingSubject.next(true)
      subscription.unsubscribe()

      expect(currentIsLoading).toEqual(true)
    }))

    it('should delay before updating isLoadingDebounced$', async (done) => {
      const isLoadingSubject = updateIsLoading(component)

      let currentIsLoadingDebounced: boolean
      const subscription = component.isLoadingDebounced$
        .subscribe(isLoadingDebounced => currentIsLoadingDebounced = isLoadingDebounced)

      isLoadingSubject.next(true)
      expect(currentIsLoadingDebounced).toBeUndefined()

      await new Promise(resolve => setTimeout(resolve, 1000))
      subscription.unsubscribe()
      expect(currentIsLoadingDebounced).toEqual(true)

      done()
    })
  })
})
