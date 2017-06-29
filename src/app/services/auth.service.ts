import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  private readonly defaultUrl: string = '/decks';
  readonly isLoggedIn$: Observable<boolean>;
  redirectUrl: string;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.isLoggedIn$ = this.afAuth.authState.map(u => u !== null);

    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.applyRedirect();
      }

      if (!isLoggedIn && this.router.url !== '/login') {
        this.applyRedirect('/login');
      }
    });
  }

  get user$(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  applyRedirect(urlOverride: string = null): void {
    this.router.navigate([ urlOverride || this.redirectUrl || this.defaultUrl ]);
    this.redirectUrl = null;
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}