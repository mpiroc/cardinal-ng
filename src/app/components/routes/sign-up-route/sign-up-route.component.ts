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
  signUpSetEmail,
  signUpSetPassword,
} from '../../../redux/actions/sign-up'
import { IState } from '../../../redux/state'

@Component({
  selector: 'cardinal-sign-up-route',
  templateUrl: './sign-up-route.component.html',
  styleUrls: [ './sign-up-route.component.scss' ],
})
export class SignUpRouteComponent {
  @select(['user', 'isLoading'])
  readonly isLoading$: Observable<boolean>

  @select(['signUp', 'isSubmitting'])
  readonly isSubmitting$: Observable<boolean>

  @select(['signUp', 'userError'])
  readonly userError$: Observable<string>

  @select(['signUp', 'passwordError'])
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

      return !!state.signUp.get(errorType)
    }
  }

  signUpWithGoogle(): void {
    this.authService.signUpWithGoogle()
  }

  signUpWithFacebook(): void {
    this.authService.signUpWithFacebook()
  }

  signUpWithTwitter(): void {
    this.authService.signUpWithTwitter()
  }

  signUpWithEmail(): void {
    const state: IState = this.ngRedux.getState()
    const email: string = state.signUp.get('email')
    const password: string = state.signUp.get('password')

    this.authService.signUpWithEmail(email, password)
  }

  onEmailInput($event: any) {
    this.ngRedux.dispatch(signUpSetEmail($event.target.value))
  }

  onPasswordInput($event: any) {
    this.ngRedux.dispatch(signUpSetPassword($event.target.value))
  }
}
