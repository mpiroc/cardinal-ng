import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/startWith'
import { AuthService } from '../../../services/firebase/auth.service'

@Component({
  selector: 'cardinal-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ './sidenav.component.scss' ],
})
export class SidenavComponent implements OnInit {
  _isLoading$: Subject<boolean> = new Subject<boolean>()
  isLoading$: Observable<boolean>

  constructor(readonly authService: AuthService) {
  }

  ngOnInit() {
    this._isLoading$ = new Subject<boolean>()
    this.isLoading$ = this._isLoading$.startWith(true)
  }
}
