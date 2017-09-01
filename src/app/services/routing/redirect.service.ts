import { Injectable } from '@angular/core';
import {
  Router,
  GuardsCheckStart,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { AuthService } from '../auth.service';

@Injectable()
export class RedirectService {
  constructor(private router: Router, private authService: AuthService) {
  }

  startListening() {
    const guardsCheckStart$ = this.router.events
      .filter(event => event instanceof GuardsCheckStart)
      .map(event => event as GuardsCheckStart);

    Observable.combineLatest(
      guardsCheckStart$,
      this.authService.isLoggedIn$,
    ).subscribe(results => this.redirect(results[0].url, results[1]));
  }

  redirect(url: string, isLoggedIn: boolean) {
    if (isLoggedIn && url === "/login") {
      this.router.navigate(["/decks"]);
    }

    if (!isLoggedIn && url !== "/login") {
      this.router.navigate(["/login"]);
    }
  }
}