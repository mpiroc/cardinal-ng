import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
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
  private emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  private passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/),
  ]);

  private isValid$: Observable<boolean> = Observable.combineLatest(
      this.emailFormControl.statusChanges,
      this.passwordFormControl.statusChanges,
    ).map(results => results[0] === 'VALID' && results[1] === 'VALID');

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
