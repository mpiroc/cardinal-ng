import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IState } from '../../redux/state';

@Component({
  selector: 'cardinal-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.css' ],
})
export class ToolbarComponent {
  private title = 'Cardinal';

  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>;
}
