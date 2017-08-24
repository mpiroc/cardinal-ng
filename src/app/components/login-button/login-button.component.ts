import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'cardinal-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: [ './login-button.component.css' ],
})
export class LoginButtonComponent {
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