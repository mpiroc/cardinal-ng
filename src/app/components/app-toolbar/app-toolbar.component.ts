import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IState } from '../../redux/state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: [ './app-toolbar.component.css' ],
})
export class AppToolbarComponent {
  title = 'Cardinal';
}