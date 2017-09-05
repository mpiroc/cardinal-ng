import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

@Component({
  selector: 'cardinal-sign-up-route',
  templateUrl: './sign-up-route.component.html',
  styleUrls: [ './sign-up-route.component.css' ],
})
export class SignUpRouteComponent {
  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>;
}
