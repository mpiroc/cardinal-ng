import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { NgRedux } from '@angular-redux/store';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IState } from '../../redux/state';
import { UserActions } from '../../redux/actions/firebase';

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

    await this.afAuth.auth.setPersistence(persistence);
    await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async signUpWithEmail(email: string, password: string): firebase.Promise<any> {
    await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
