import { Component, Input, OnChanges } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/debounce'

@Component({
  selector: 'cardinal-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: [ './loading-spinner.component.scss' ],
})
export class LoadingSpinnerComponent implements OnChanges {
  @Input()
  isLoading$: Observable<boolean>

  isLoadingDebounced$: Observable<boolean>

  ngOnChanges() {
    this.isLoadingDebounced$ = this.isLoading$
      .debounce(isLoading => isLoading ?
        Observable.timer(300) :
        Observable.timer(0))
  }
}
