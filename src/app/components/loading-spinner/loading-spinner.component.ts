import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/debounce';

@Component({
  selector: 'cardinal-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: [ './loading-spinner.component.css' ],
})
export class LoadingSpinnerComponent implements OnInit {
  @Input()
  isLoading$: Observable<boolean>;

  isLoadingDebounced$: Observable<boolean>;

  ngOnInit() {
    this.isLoadingDebounced$ = this.isLoading$
      .debounce(isLoading => isLoading ?
        Observable.timer(300) :
        Observable.timer(0));
  }
}