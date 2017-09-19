import { Component } from '@angular/core'
import { NgRedux, select } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import { IState } from '../../../redux/state'
import { AuthService } from '../../../services/firebase/auth.service'

@Component({
  selector: 'cardinal-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.scss' ],
})
export class ToolbarComponent {
  readonly title = 'Cardinal'

  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>

  constructor(readonly authService: AuthService) {
  }

  onSignOut() {
    this.authService.signOut()
  }
}
