import { Injectable } from '@angular/core'
import { NgRedux } from '@angular-redux/store'
import { auth } from 'firebase/app'
import { Observable } from 'rxjs/Observable'
import { IState } from '../../redux/state'
import { AuthShimService } from './auth-shim.service'
import { UserActions } from '../../redux/actions/firebase'
import {
  signInSubmit,
  signInSubmitSuccess,
  signInSubmitUserError,
  signInSubmitPasswordError,
  signInSubmitProviderError,
} from '../../redux/actions/sign-in'
import {
  signUpSubmit,
  signUpSubmitSuccess,
  signUpSubmitUserError,
  signUpSubmitPasswordError,
  signUpSubmitProviderError,
} from '../../redux/actions/sign-up'

export abstract class AuthService {
  isLoading$: Observable<boolean>
  isLoggedIn$: Observable<boolean>

  abstract signInWithGoogle(): void
  abstract signInWithFacebook(): void
  abstract signInWithTwitter(): void

  abstract signInWithEmail(email: string, password: string, rememberMe: boolean): Promise<any>

  abstract signUpWithGoogle(): void
  abstract signUpWithFacebook(): void
  abstract signUpWithTwitter(): void

  abstract signUpWithEmail(email: string, password: string): Promise<any>

  abstract signOut(): void
  abstract resetPassword(email: string): Promise<any>
}

@Injectable()
export class AuthServiceImplementation extends AuthService {
  isLoading$: Observable<boolean>
  isLoggedIn$: Observable<boolean>

  constructor(
    private authShim: AuthShimService,
    private ngRedux: NgRedux<IState>,
    private userActions: UserActions,
  ) {
    super()

    this.isLoading$ = ngRedux
      .select(['user', 'isLoading'])
    this.isLoggedIn$ = ngRedux
      .select(['user', 'data', 'uid'])
      .map(uid => !!uid)
  }

  signInWithGoogle(): Promise<any> {
    return this.signInWithProvider(new auth.GoogleAuthProvider())
  }

  signInWithFacebook(): Promise<any> {
    return this.signInWithProvider(new auth.FacebookAuthProvider())
  }

  signInWithTwitter(): Promise<any> {
    return this.signInWithProvider(new auth.TwitterAuthProvider())
  }

  private async signInWithProvider(provider: auth.AuthProvider): Promise<any> {
    try {
      this.ngRedux.dispatch(signInSubmit())
      this.ngRedux.dispatch(this.userActions.setIsLoading({}, true))

      await this.authShim.setPersistence(auth.Auth.Persistence.LOCAL)
      await this.authShim.signInWithPopup(provider)

      this.ngRedux.dispatch(signInSubmitSuccess())
    } catch (error) {
      this.ngRedux.dispatch(signInSubmitProviderError(error.message))
    }
  }

  async signInWithEmail(email: string, password: string, rememberMe: boolean): Promise<any> {
    try {
      this.ngRedux.dispatch(signInSubmit())
      this.ngRedux.dispatch(this.userActions.setIsLoading({}, true))

      const persistence = rememberMe ?
        auth.Auth.Persistence.LOCAL :
        auth.Auth.Persistence.SESSION
      await this.authShim.setPersistence(persistence)
      await this.authShim.signInWithEmailAndPassword(email, password)

      this.ngRedux.dispatch(signInSubmitSuccess())
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.ngRedux.dispatch(signInSubmitUserError('There is no user with this email address.'))
          break

        case 'auth/user-disabled':
          this.ngRedux.dispatch(signInSubmitUserError('The user with this email address has been disabled.'))
          break

        case 'auth/wrong-password':
          this.ngRedux.dispatch(signInSubmitPasswordError('Invalid password'))
          break

        default:
          // Show miscellaneous errors with password errors.
          this.ngRedux.dispatch(signInSubmitPasswordError(error.message))
          break
      }
    }
  }

  signUpWithGoogle(): Promise<any> {
    return this.signUpWithProvider(new auth.GoogleAuthProvider())
  }

  signUpWithFacebook(): Promise<any> {
    return this.signUpWithProvider(new auth.FacebookAuthProvider())
  }

  signUpWithTwitter(): Promise<any> {
    return this.signUpWithProvider(new auth.TwitterAuthProvider())
  }

  private async signUpWithProvider(provider: auth.AuthProvider): Promise<any> {
    try {
      this.ngRedux.dispatch(signUpSubmit())
      this.ngRedux.dispatch(this.userActions.setIsLoading({}, true))

      await this.authShim.setPersistence(auth.Auth.Persistence.LOCAL)
      await this.authShim.signInWithPopup(provider)

      this.ngRedux.dispatch(signUpSubmitSuccess())
    } catch (error) {
      this.ngRedux.dispatch(signUpSubmitProviderError(error.message))
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<any> {
    try {
      this.ngRedux.dispatch(signUpSubmit())
      this.ngRedux.dispatch(this.userActions.setIsLoading({}, true))

      await this.authShim.setPersistence(auth.Auth.Persistence.LOCAL)
      await this.authShim.createUserWithEmailAndPassword(email, password)

      this.ngRedux.dispatch(signUpSubmitSuccess())
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.ngRedux.dispatch(signUpSubmitUserError('There is no user with this email address.'))
          break

        case 'auth/user-disabled':
          this.ngRedux.dispatch(signUpSubmitUserError('The user with this email address has been disabled.'))
          break

        case 'auth/invalid-email':
          this.ngRedux.dispatch(signUpSubmitUserError('Invalid email address'))
          break

        case 'auth/wrong-password':
          this.ngRedux.dispatch(signUpSubmitPasswordError('Invalid password'))
          break

        default:
          // Show miscellaneous errors with password errors.
          this.ngRedux.dispatch(signUpSubmitPasswordError(error.message))
          break
      }
    }
  }

  signOut(): Promise<any> {
    return this.authShim.signOut()
  }

  resetPassword(email: string): Promise<any> {
    return this.authShim.sendPasswordResetEmail(email)
  }
}
