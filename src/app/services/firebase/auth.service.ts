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
      .select(["user", "isLoading"]);
    this.isLoggedIn$ = ngRedux
      .select(["user", "data", "uid"])
      .map(uid => uid ? true : false);
  }

  login(): void {
    const provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});

    this.afAuth.auth.signInWithPopup(provider);
    
    this.ngRedux.dispatch(UserActions.setIsLoading({}, true));
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}