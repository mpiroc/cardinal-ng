import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/firebase/auth.service';
import {
  signUpSetEmail,
  signUpSetPassword,
} from '../../redux/actions/sign-up';
import { IState } from '../../redux/state';

@Component({
  selector: 'cardinal-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.component.css' ],
})
export class SignUpComponent {
  private emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  private passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/),
  ])

  constructor(private authService: AuthService, private ngRedux: NgRedux<IState>) {
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