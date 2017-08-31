import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { UserActions } from '../redux/actions/firebase';
import { AuthService } from './auth.service';
import { LogService } from './log.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private logService: LogService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // TODO: There is a memory leak here. What is causing it?
    return this.checkUrl(state.url)
      .catch(error => { 
        this.logService.error(error);
        return Observable.of(UserActions.error({}, error.message));
      });
  }

  private checkUrl(url: string): Observable<boolean> {
    return this.authService.isLoggedIn$.map(isLoggedIn => {
      if (isLoggedIn) {
        return url !== "/login";
      }

      return url === "/login";
    });
  }
}