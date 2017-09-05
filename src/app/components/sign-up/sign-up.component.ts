import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

@Component({
  selector: 'cardinal-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.component.css' ],
})
export class SignUpComponent {
  @select(['user', 'isLoading'])
  isLoading$: Observable<boolean>;
}