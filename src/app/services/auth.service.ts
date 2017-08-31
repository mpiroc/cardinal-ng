import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User, auth } from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class AuthService {
  readonly user$: Observable<User>;
  readonly isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
    this.isLoggedIn$ = this.user$.map(u => u !== null);
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}