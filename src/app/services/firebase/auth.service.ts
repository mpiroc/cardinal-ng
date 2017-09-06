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
    //provider.setCustomParameters({prompt: 'select_account'});

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

  signInWithProvider(provider: auth.AuthProvider): void {
    this.afAuth.auth.signInWithPopup(provider);

    this.ngRedux.dispatch(UserActions.setIsLoading({}, true));
  }

  async signInWithEmail(email: string, password: string): firebase.Promise<any> {
    //try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    //}
    /*
    catch (error) {
      // TODO
    }
    */
  }

  async signUpWithEmail(email: string, password: string): firebase.Promise<any> {
    //try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    //}
    /*
    catch (error) {
      // TODO
    }
    */
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
