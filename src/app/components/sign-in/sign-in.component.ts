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

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signInWithFacebook(): void {
    this.authService.signInWithFacebook();
  }

  signInWithTwitter(): void {

  }

  signInWithEmail(): void {

  }

  onEmailChanged() {

  }

  onPasswordChanged() {

  }

  onRememberMeChanged() {
    
  }
}