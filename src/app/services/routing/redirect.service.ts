import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import {
  Router,
  GuardsCheckStart,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { AuthService } from '../firebase/auth.service';

@Injectable()
export class RedirectService {
  private readonly publicUrls: string[] = [
    '/sign-in',
    '/sign-up',
    '/reset-password',
  ];

  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  startListening() {
    const guardsCheckStart$ = this.router.events
      .filter(event => event instanceof GuardsCheckStart)
      .map(event => event as GuardsCheckStart);

    guardsCheckStart$
      .switchMap(event => this.authService.isLoading$
        .filter(isLoading => !isLoading)
        .switchMap(isLoading => this.authService.isLoggedIn$
          .do(isLoggedIn => this.redirect(event.url, isLoggedIn))
        )
      ).subscribe();
  }

  redirect(url: string, isLoggedIn: boolean) {
    const isUrlPublic: boolean = !!this.publicUrls.find(publicUrl => publicUrl === url);

    if (isLoggedIn && isUrlPublic) {
      this.router.navigate(['/decks']);
    }

    if (!isLoggedIn && !isUrlPublic) {
      this.router.navigate(['/sign-in']);
    }
  }
}
