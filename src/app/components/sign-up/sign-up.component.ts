import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { FormBuilder } from '@angular/forms';
import { AuthForm } from '../../forms/auth.form';
import { AuthService } from '../../services/firebase/auth.service';
import {
  signUpSetEmail,
  signUpSetPassword,
} from '../../redux/actions/sign-up';
import { IState } from '../../redux/state';

@Component({
  selector: 'cardinal-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.component.scss' ],
})
export class SignUpComponent {
  readonly form: AuthForm;

  constructor(
    private authService: AuthService,
    private ngRedux: NgRedux<IState>,
    private formBuilder: FormBuilder,
  ) {
    this.form = new AuthForm(formBuilder);
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
    const state: IState = this.ngRedux.getState();
    const email: string = state.signUp.get('email');
    const password: string = state.signUp.get('password');

    this.authService.signUpWithEmail(email, password);
  }

  onEmailInput($event: any) {
    this.ngRedux.dispatch(signUpSetEmail($event.target.value));
  }

  onPasswordInput($event: any) {
    this.ngRedux.dispatch(signUpSetPassword($event.target.value));
  }
}
