import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

@Component({
  selector: 'cardinal-sign-in-route',
  templateUrl: './sign-in-route.component.html',
  styleUrls: [ './sign-in-route.component.scss' ],
})
export class SignInRouteComponent {
  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>;
}
