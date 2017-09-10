import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IState } from '../state';
import {
  signInSetEmail,
  signInSetPassword,
  signInSetRememberMe,
  signInSubmit,
  signInSubmitSuccess,
  signInSubmitUserError,
  signInSubmitPasswordError,
  signInSubmitOtherError,
} from '../actions/sign-in';

@Injectable()
export class SignInStateService {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  private get state(): Map<string, any> {
    return this.ngRedux.getState().signIn;
  }

  get email(): string {
    return this.state.get('email');
  }

  get password(): string {
    return this.state.get('password');
  }

  get rememberMe(): boolean {
    return this.state.get('rememberMe');
  }

  get isSubmitting(): boolean {
    return this.state.get('isSubmitting');
  }

  get userError(): string {
    return this.state.get('userError');
  }

  get passwordError(): string {
    return this.state.get('passwordError');
  }

  get otherError(): string {
    return this.state.get('otherError');
  }

  selectEmail(): Observable<string> {
    return this.ngRedux.select(['signIn', 'email']);
  }

  selectPassword(): Observable<string> {
    return this.ngRedux.select(['signIn', 'password']);
  }

  selectRememberMe(): Observable<boolean> {
    return this.ngRedux.select(['signIn', 'rememberMe']);
  }

  selectIsSubmitting(): Observable<boolean> {
    return this.ngRedux.select(['signIn', 'isSubmitting']);
  }

  selectUserError(): Observable<string> {
    return this.ngRedux.select(['signIn', 'userError']);
  }

  selectPasswordError(): Observable<string> {
    return this.ngRedux.select(['signIn', 'password']);
  }

  selectOtherError(): Observable<string> {
    return this.ngRedux.select(['signIn', 'otherError']);
  }

  setEmail(email: string) {
    this.ngRedux.dispatch(signInSetEmail(email));
  }

  setPassword(password: string) {
    this.ngRedux.dispatch(signInSetPassword(password));
  }

  setRememberMe(rememberMe: boolean) {
    this.ngRedux.dispatch(signInSetRememberMe(rememberMe));
  }

  submit() {
    this.ngRedux.dispatch(signInSubmit());
  }

  submitSuccess() {
    this.ngRedux.dispatch(signInSubmitSuccess());
  }

  submitUserError(error: string) {
    this.ngRedux.dispatch(signInSubmitUserError(error));
  }

  submitPasswordError(error: string) {
    this.ngRedux.dispatch(signInSubmitPasswordError(error));
  }

  submitOtherError(error: string) {
    this.ngRedux.dispatch(signInSubmitOtherError(error));
  }
}
