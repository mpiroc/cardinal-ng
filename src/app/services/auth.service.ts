import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
    const url: string = urlOverride || this.redirectUrl || this.defaultUrl;

    this.router.navigate([ url ]);
    this.redirectUrl = null;
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}