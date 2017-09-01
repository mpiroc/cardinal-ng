import { Component, ContentChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cardinal-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ './sidenav.component.css' ],
})
export class SidenavComponent implements OnInit {
  _isLoading$: Subject<boolean> = new Subject<boolean>();
  isLoading$: Observable<boolean>;

  ngOnInit() {
    this._isLoading$ = new Subject<boolean>();
    this.isLoading$ = this._isLoading$.startWith(true);
  }
}