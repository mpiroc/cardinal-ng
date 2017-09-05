import { Component } from '@angular/core';
import { AuthService } from '../../services/firebase/auth.service';

@Component({
  selector: 'cardinal-sign-in-component',
  templateUrl: './sign-in.component.html',
  styleUrls: [ './sign-in.component.css' ],
})
export class SignInComponent {
  constructor(private authService: AuthService) {
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}