import { Component } from '@angular/core';

@Component({
  selector: 'app-login-button',
  templateUrl: 'app-login-button.component.html',
  styleUrls: [ 'app-login-button.component.css' ],
})
export class AppLoginButtonComponent {
  isLoggedIn: boolean = false;
}