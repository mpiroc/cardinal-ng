import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { select } from '@angular-redux/store'

@Component({
  selector: 'cardinal-reset-password-confirmation-route',
  templateUrl: './reset-password-confirmation-route.component.html',
  styleUrls: [ './reset-password-confirmation-route.component.scss' ],
})
export class ResetPasswordConfirmationRouteComponent {
  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>

  email$: Observable<string>

  constructor(activatedRoute: ActivatedRoute) {
    this.email$ = activatedRoute.queryParams.map(params => params['email'])
  }
}
