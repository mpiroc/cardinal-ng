import { Component } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Component({
  selector: 'cardinal-tap-target',
  templateUrl: './tap-target.component.html',
  styleUrls: [ './tap-target.component.scss' ],
})
export class TapTargetComponent {
  readonly tapTargetState$: Observable<string>

  constructor() {
    this.tapTargetState$ = Observable
      .interval(3000)
      .map(value => value % 2 === 0 ? "expanded" : "collapsed")
      .startWith('collapsed')
  }
}