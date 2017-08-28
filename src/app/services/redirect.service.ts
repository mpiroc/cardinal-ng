import { Injectable } from '@angular/core';
import {
  Router,
  GuardsCheckStart,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { AuthService } from './auth.service';

@Injectable()
export class RedirectService {
  constructor(private router: Router, private authService: AuthService) {
  }

  startListening() {
    this.router.events
      .filter(event => event instanceof GuardsCheckStart)
      .map(event => event as GuardsCheckStart)
      .switchMap(event => this.authService.isLoggedIn$
        .map(isLoggedIn => { return {
          event,
          isLoggedIn,
        }})
      )
      .subscribe(result => {
        
        if (result.isLoggedIn && result.event.url === "/login") {
          this.router.navigate(["/decks"]);
        }

        if (!result.isLoggedIn && result.event.url !== "/login") {
          this.router.navigate(["/login"]);
        }
      });
  }
}