import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import {
  FormBuilder,
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  readonly formGroup: FormGroup;

  readonly isValid$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private ngRedux: NgRedux<IState>,
    private formBuilder: FormBuilder,
  ) {
    this.formGroup = formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/),
      ]],
    });

    this.isValid$ = this.formGroup.statusChanges.map(status => status === 'VALID');
  }

  getFirstEmailError(): string {
    return this.getFirstError(
      this.formGroup.get('email'),
      ['required', 'email'],
    );
  }

  getFirstPasswordError(): string {
    return this.getFirstError(
      this.formGroup.get('password'),
      ['required', 'minlength', 'pattern'],
    );
  }

  private getFirstError(control: AbstractControl, errors: string[]) {
    return errors.find(error => control.hasError(error));
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
