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
  signInSubmitOtherError,
} from '../../redux/actions/sign-in';
import {
  signUpSubmit,
  signUpSubmitSuccess,
  signUpSubmitUserError,
  signUpSubmitPasswordError,
  signUpSubmitOtherError,
} from '../../redux/actions/sign-up';

@Injectable()
export class AuthService {
  isLoading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth, private ngRedux: NgRedux<IState>) {
    this.isLoading$ = ngRedux
      .select(['user', 'isLoading']);
    this.isLoggedIn$ = ngRedux
      .select(['user', 'data', 'uid'])
      .map(uid => uid ? true : false);
  }

  signInWithGoogle(): void {
    const provider = new auth.GoogleAuthProvider();

    this.signInWithProvider(provider);
  }

  signInWithFacebook(): void {
    const provider = new auth.FacebookAuthProvider();

    this.signInWithProvider(provider);
  }

  signInWithTwitter(): void {
    const provider = new auth.TwitterAuthProvider();

    this.signInWithProvider(provider);
  }

  async signInWithProvider(provider: auth.AuthProvider): firebase.Promise<any> {
    this.ngRedux.dispatch(UserActions.setIsLoading({}, true));

    await this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
    await this.afAuth.auth.signInWithPopup(provider);
  }

  async signInWithEmail(email: string, password: string, rememberMe: boolean): firebase.Promise<any> {
    const persistence = rememberMe ?
      auth.Auth.Persistence.LOCAL :
      auth.Auth.Persistence.SESSION;

    this.ngRedux.dispatch(signInSubmit());
    try {
      await this.afAuth.auth.setPersistence(persistence);
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);

      this.ngRedux.dispatch(signInSubmitSuccess());
    }
    catch (error) {
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
          this.ngRedux.dispatch(signInSubmitOtherError(error.message));
          break;
      }
    }
  }

  async signUpWithEmail(email: string, password: string): firebase.Promise<any> {
    this.ngRedux.dispatch(signUpSubmit());

    try {
      await this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);

      this.ngRedux.dispatch(signUpSubmitSuccess());
    }
    catch (error) {
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
          console.log(error.code);
          this.ngRedux.dispatch(signUpSubmitOtherError(error.message));
          break;
      }
    }    
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  resetPassword(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
