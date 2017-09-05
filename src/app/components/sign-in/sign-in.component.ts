import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AuthService } from '../../services/firebase/auth.service';
import {
  signInSetEmail,
  signInSetPassword,
  signInSetRememberMe,
} from '../../redux/actions/sign-in';
import { IState } from '../../redux/state';

@Component({
  selector: 'cardinal-sign-in-component',
  templateUrl: './sign-in.component.html',
  styleUrls: [ './sign-in.component.css' ],
})
export class SignInComponent {
  constructor(private authService: AuthService, private ngRedux: NgRedux<IState>) {
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signInWithFacebook(): void {
    this.authService.signInWithFacebook();
  }

  signInWithTwitter(): void {
    this.authService.signInWithTwitter();
  }

  signInWithEmail(): void {
    
  }

  onEmailInput($event: any) {
    this.ngRedux.dispatch(signInSetEmail($event.target.value));
  }

  onPasswordInput($event: any) {
    this.ngRedux.dispatch(signInSetPassword($event.target.value));
  }

  onRememberMeChanged($event: any) {
    this.ngRedux.dispatch(signInSetRememberMe($event.checked));
  }
}