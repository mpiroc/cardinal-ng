import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IState } from '../state';
import {
  resetPasswordSetEmail,
} from '../actions/reset-password';

@Injectable()
export class ResetPasswordStateService {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  private get state(): Map<string, any> {
    return this.ngRedux.getState().resetPassword;
  }

  get email() {
    return this.state.get('email');
  }

  selectEmail(): Observable<string> {
    return this.ngRedux.select(['resetPassword', 'email']);
  }

  setEmail(email: string) {
    this.ngRedux.dispatch(resetPasswordSetEmail(email));
  }
}
