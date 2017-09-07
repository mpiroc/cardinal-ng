import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

@Component({
  selector: 'cardinal-reset-password-route',
  templateUrl: './reset-password-route.component.html',
  styleUrls: [ './reset-password-route.component.scss' ],
})
export class ResetPasswordRouteComponent {
  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>;
}
