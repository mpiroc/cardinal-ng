import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IState } from '../state';
import {
  signUpSetEmail,
  signUpSetPassword,
  signUpSubmit,
  signUpSubmitSuccess,
  signUpSubmitUserError,
  signUpSubmitPasswordError,
  signUpSubmitOtherError,
} from '../actions/sign-up';

@Injectable()
export class SignUpStateService {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  private get state(): Map<string, any> {
    return this.ngRedux.getState().signUp;
  }

  get email(): string {
    return this.state.get('email');
  }

  get password(): string {
    return this.state.get('password');
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
    return this.ngRedux.select(['signUp', 'email']);
  }

  selectPassword(): Observable<string> {
    return this.ngRedux.select(['signUp', 'password']);
  }

  selectIsSubmitting(): Observable<boolean> {
    return this.ngRedux.select(['signUp', 'isSubmitting']);
  }

  selectUserError(): Observable<string> {
    return this.ngRedux.select(['signUp', 'userError']);
  }

  selectPasswordError(): Observable<string> {
    return this.ngRedux.select(['signUp', 'password']);
  }

  selectOtherError(): Observable<string> {
    return this.ngRedux.select(['signUp', 'otherError']);
  }

  setEmail(email: string) {
    this.ngRedux.dispatch(signUpSetEmail(email));
  }

  setPassword(password: string) {
    this.ngRedux.dispatch(signUpSetPassword(password));
  }

  submit() {
    this.ngRedux.dispatch(signUpSubmit());
  }

  submitSuccess() {
    this.ngRedux.dispatch(signUpSubmitSuccess());
  }

  submitUserError(error: string) {
    this.ngRedux.dispatch(signUpSubmitUserError(error));
  }

  submitPasswordError(error: string) {
    this.ngRedux.dispatch(signUpSubmitPasswordError(error));
  }

  submitOtherError(error: string) {
    this.ngRedux.dispatch(signUpSubmitOtherError(error));
  }
}
