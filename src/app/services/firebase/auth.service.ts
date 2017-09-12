import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { NgRedux } from '@angular-redux/store';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IState } from '../../redux/state';
import { UserActions } from '../../redux/actions/firebase';
import {
  signInSubmit,
  signInSubmitSuccess,
  signInSubmitUserError,
  signInSubmitPasswordError,
  signInSubmitProviderError,
} from '../../redux/actions/sign-in';
import {
  signUpSubmit,
  signUpSubmitSuccess,
  signUpSubmitUserError,
  signUpSubmitPasswordError,
  signUpSubmitProviderError,
} from '../../redux/actions/sign-up';

export abstract class AuthService {
  isLoading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  abstract signInWithGoogle(): void;
  abstract signInWithFacebook(): void;
  abstract signInWithTwitter(): void;

  abstract signInWithEmail(email: string, password: string, rememberMe: boolean): Promise<any>;

  abstract signUpWithGoogle(): void;
  abstract signUpWithFacebook(): void;
  abstract signUpWithTwitter(): void;

  abstract signUpWithEmail(email: string, password: string): Promise<any>;

  abstract signOut(): void;
  abstract resetPassword(email: string): Promise<any>;
}

@Injectable()
export class AuthServiceImplementation extends AuthService {
  isLoading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private ngRedux: NgRedux<IState>,
    private userActions: UserActions,
  ) {
    super();

    this.isLoading$ = ngRedux
      .select(['user', 'isLoading']);
    this.isLoggedIn$ = ngRedux
      .select(['user', 'data', 'uid'])
      .map(uid => uid ? true : false);
  }

  signInWithGoogle(): void {
    this.signInWithProvider(new auth.GoogleAuthProvider());
  }

  signInWithFacebook(): void {
    this.signInWithProvider(new auth.FacebookAuthProvider());
  }

  signInWithTwitter(): void {
    this.signInWithProvider(new auth.TwitterAuthProvider());
  }

  private async signInWithProvider(provider: auth.AuthProvider): Promise<any> {
    this.ngRedux.dispatch(signInSubmit());

    try {
      this.ngRedux.dispatch(this.userActions.setIsLoading({}, true));

      await this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
      await this.afAuth.auth.signInWithPopup(provider);

      this.ngRedux.dispatch(signInSubmitSuccess());
    } catch (error) {
      this.ngRedux.dispatch(signInSubmitProviderError(error.message));
    }
  }

  async signInWithEmail(email: string, password: string, rememberMe: boolean): Promise<any> {
    const persistence = rememberMe ?
      auth.Auth.Persistence.LOCAL :
      auth.Auth.Persistence.SESSION;

    this.ngRedux.dispatch(signInSubmit());
    try {
      await this.afAuth.auth.setPersistence(persistence);
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);

      this.ngRedux.dispatch(signInSubmitSuccess());
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.ngRedux.dispatch(signInSubmitUserError('There is no user with this email address.'));
          break;

        case 'auth/user-disabled':
          this.ngRedux.dispatch(signInSubmitUserError('The user with this email address has been disabled.'));
          break;

        case 'auth/wrong-password':
          this.ngRedux.dispatch(signInSubmitPasswordError('Invalid password'));
          break;

        default:
          // Show miscellaneous errors with password errors.
          this.ngRedux.dispatch(signInSubmitPasswordError(error.message));
          break;
      }
    }
  }

  signUpWithGoogle(): void {
    this.signUpWithProvider(new auth.GoogleAuthProvider());
  }

  signUpWithFacebook(): void {
    this.signUpWithProvider(new auth.FacebookAuthProvider());
  }

  signUpWithTwitter(): void {
    this.signUpWithProvider(new auth.TwitterAuthProvider());
  }

  private async signUpWithProvider(provider: auth.AuthProvider): Promise<any> {
    this.ngRedux.dispatch(signUpSubmit());

    try {
      this.ngRedux.dispatch(this.userActions.setIsLoading({}, true));

      await this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
      await this.afAuth.auth.signInWithPopup(provider);

      this.ngRedux.dispatch(signUpSubmitSuccess());
    } catch (error) {
      this.ngRedux.dispatch(signUpSubmitProviderError(error.message));
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<any> {
    this.ngRedux.dispatch(signUpSubmit());

    try {
      await this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);

      this.ngRedux.dispatch(signUpSubmitSuccess());
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.ngRedux.dispatch(signUpSubmitUserError('There is no user with this email address.'));
          break;

        case 'auth/user-disabled':
          this.ngRedux.dispatch(signUpSubmitUserError('The user with this email address has been disabled.'));
          break;

        case 'auth/invalid-email':
          this.ngRedux.dispatch(signUpSubmitUserError('Invalid email address'));
          break;

        case 'auth/wrong-password':
          this.ngRedux.dispatch(signUpSubmitPasswordError('Invalid password'));
          break;

        default:
          // Show miscellaneous errors with password errors.
          this.ngRedux.dispatch(signUpSubmitPasswordError(error.message));
          break;
      }
    }
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  async resetPassword(email: string): Promise<any> {
    return await this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
