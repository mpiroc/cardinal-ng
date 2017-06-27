import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-button',
  templateUrl: 'app-login-button.component.html',
  styleUrls: [ 'app-login-button.component.css' ],
})
export class AppLoginButtonComponent {
  constructor(private authService: AuthService) {
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}