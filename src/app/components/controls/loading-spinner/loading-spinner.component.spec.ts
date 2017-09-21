import { SimpleChange } from '@angular/core'
import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { LoadingSpinnerComponent } from './loading-spinner.component'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

function updateIsLoading(
  component: LoadingSpinnerComponent,
): Subject<boolean> {
  const isLoadingSubject = new Subject<boolean>()

  component.isLoading$ = isLoadingSubject
  component.ngOnChanges()

  return isLoadingSubject
}


describe('components', () => {
  describe('LoadingSpinnerComponent', () => {
    let component: LoadingSpinnerComponent

    beforeEach(async(() => {
      TestBed.configureTestingModule(config).compileComponents()

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

      expect(currentIsLoadingDebounced).toEqual(true)

      done()
    })
  })
})
