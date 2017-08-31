import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { NgRedux } from '@angular-redux/store';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IState } from '../redux/state';

@Injectable()
export class AuthService {
  isLoggedIn$: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth, ngRedux: NgRedux<IState>) {
    this.isLoggedIn$ = ngRedux
      .select(["user", "data", "uid"])
      .map(uid => uid ? true : false);
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}