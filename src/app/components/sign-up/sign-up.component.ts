import { Component } from '@angular/core';
import { AuthService } from '../../services/firebase/auth.service';

@Component({
  selector: 'cardinal-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.component.css' ],
})
export class SignUpComponent {
  constructor(private authService: AuthService) {
  }

  signUpWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signUpWithFacebook(): void {
    this.authService.signInWithFacebook();
  }

  signUpWithTwitter(): void {
    this.authService.signInWithTwitter();
  }

  signUpWithEmail(): void {

  }

  onEmailChanged() {

  }

  onPasswordChanged() {

  }
}