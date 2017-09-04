import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

@Component({
  selector: 'cardinal-login-route',
  templateUrl: './login-route.component.html',
  styleUrls: [ './login-route.component.css' ],
})
export class LoginRouteComponent {
  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>;
}
