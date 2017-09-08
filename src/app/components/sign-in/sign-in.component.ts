import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { FormBuilder } from '@angular/forms';
import { AuthForm } from '../../forms/auth.form';
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
  styleUrls: [ './sign-in.component.scss' ],
})
export class SignInComponent {
  readonly form: AuthForm;

  constructor(
    private authService: AuthService,
    private ngRedux: NgRedux<IState>,
    private formBuilder: FormBuilder,
  ) {
    this.form = new AuthForm(formBuilder);
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
    const state: IState = this.ngRedux.getState();
    const email: string = state.signIn.get('email');
    const password: string = state.signIn.get('password');
    const rememberMe: boolean = state.signIn.get('rememberMe');

    this.authService.signInWithEmail(email, password, rememberMe);
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
