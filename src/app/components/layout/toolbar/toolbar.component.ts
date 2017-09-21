import { Component, OnInit } from '@angular/core'
import { NgRedux, select } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import { IState } from '../../../redux/state'
import { AuthService } from '../../../services/firebase/auth.service'

@Component({
  selector: 'cardinal-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.scss' ],
})
export class ToolbarComponent implements OnInit {
  readonly title = 'Cardinal'
  isLoading$: Observable<boolean>

  constructor(
    readonly authService: AuthService,
    private readonly ngRedux: NgRedux<IState>,
  ) {
  }

  ngOnInit() {
    this.isLoading$ = this.ngRedux.select(['user', 'isLoading'])
  }

  onSignOut() {
    this.authService.signOut()
  }
}
