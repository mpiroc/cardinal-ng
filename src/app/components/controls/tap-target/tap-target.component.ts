import { Component } from '@angular/core'
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';

const backgroundRadius = '200px'
const targetRadius = '28px'
const foregroundPadding = '20px'

@Component({
  selector: 'cardinal-tap-target',
  templateUrl: './tap-target.component.html',
  styleUrls: [ './tap-target.component.scss' ],
  animations: [
    trigger('tapTargetBackgroundState', [
      state('expanded', style({
        width: `calc(2 * ${backgroundRadius})`,
        height: `calc(2 * ${backgroundRadius})`,
        left: `calc(50% - ${backgroundRadius})`,
        marginTop: `calc(${targetRadius} - ${backgroundRadius})`,
        opacity: '0.96',
      })),
      state('collapsed', style({
        width: '0',
        height: '0',
        left: '50%',
        marginTop: `${targetRadius}`,
        opacity: '0',
      })),
      transition('* => *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('tapTargetForegroundState', [
      state('expanded', style({
        width: `calc(2 * ${targetRadius})`,
        height: `calc(2 * ${targetRadius})`,
        left: `calc(50% - ${targetRadius} - ${foregroundPadding})`,
        marginTop: `-${foregroundPadding}`,
        padding: `${foregroundPadding}`,
        opacity: '1',
      })),
      state('collapsed', style({
        width: '0',
        height: '0',
        left: '50%',
        marginTop: `${targetRadius}`,
        padding: '0',
        opacity: '0',
      })),
      transition('* => *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class TapTargetComponent {
  readonly tapTargetState$: Observable<string>

  constructor() {
    this.tapTargetState$ = Observable
      .interval(3000)
      .map(value => value % 2 === 0 ? "expanded" : "collapsed")
      .take(1)
      .startWith('collapsed')
  }
}