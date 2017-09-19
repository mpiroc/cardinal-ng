import { Component } from '@angular/core'
import { NgRedux, select } from '@angular-redux/store'
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { AuthForm } from '../../forms/auth.form'
import { AuthService } from '../../../services/firebase/auth.service'
import {
  signInSetEmail,
  signInSetPassword,
  signInSetRememberMe,
} from '../../../redux/actions/sign-in'
import { IState } from '../../../redux/state'

@Component({
  selector: 'cardinal-sign-in-route',
  templateUrl: './sign-in-route.component.html',
  styleUrls: [ './sign-in-route.component.scss' ],
})
export class SignInRouteComponent {
  @select(['signIn', 'isSubmitting'])
  readonly isSubmitting$: Observable<boolean>

  @select(['signIn', 'userError'])
  readonly userError$: Observable<string>

  @select(['signIn', 'passwordError'])
  readonly passwordError$: Observable<string>

  readonly form: AuthForm

  constructor(
    private authService: AuthService,
    private ngRedux: NgRedux<IState>,
    private formBuilder: FormBuilder,
  ) {
    this.form = new AuthForm(formBuilder)
  }

  getErrorStateMatcher(errorType: string) {
    return (control: FormControl, form: FormGroupDirective | NgForm) => {
      const submitted = form && form.submitted
      if (control.invalid && (control.touched || submitted)) {
        return true
      }

      if (!this.ngRedux) {
        return false
      }

      const state = this.ngRedux.getState()

      return !!state.signIn.get(errorType)
    }
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
  }

  signInWithFacebook(): void {
    this.authService.signInWithFacebook()
  }

  signInWithTwitter(): void {
    this.authService.signInWithTwitter()
  }

  signInWithEmail(): void {
    const state: IState = this.ngRedux.getState()
    const email: string = state.signIn.get('email')
    const password: string = state.signIn.get('password')
    const rememberMe: boolean = state.signIn.get('rememberMe')

    this.authService.signInWithEmail(email, password, rememberMe)
  }

  onEmailInput($event: any) {
    this.ngRedux.dispatch(signInSetEmail($event.target.value))
  }

  onPasswordInput($event: any) {
    this.ngRedux.dispatch(signInSetPassword($event.target.value))
  }

  onRememberMeChanged($event: any) {
    this.ngRedux.dispatch(signInSetRememberMe($event.checked))
  }
}
