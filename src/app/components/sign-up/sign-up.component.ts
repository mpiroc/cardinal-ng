import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
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
  @select(['signUp', 'isSubmitting'])
  readonly isSubmitting$: Observable<boolean>;

  @select(['signUp', 'userError'])
  readonly userError$: Observable<string>;

  @select(['signUp', 'passwordError'])
  readonly passwordError$: Observable<string>;

  @select(['signUp', 'otherError'])
  readonly otherError$: Observable<string>;

  readonly form: AuthForm;

  constructor(
    private authService: AuthService,
    private ngRedux: NgRedux<IState>,
    private formBuilder: FormBuilder,
  ) {
    this.form = new AuthForm(formBuilder);
  }

  getErrorStateMatcher(errorTypes: string[]) {
    return (control: FormControl, form: FormGroupDirective | NgForm) => {
      const submitted = form && form.submitted;
      if (control.invalid && (control.touched || submitted)) {
        return true;
      }

      if (!this.ngRedux) {
        return false;
      }
      
      const state = this.ngRedux.getState();

      return !!errorTypes.find(errorType => !!state.signUp.get(errorType))
    };
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
