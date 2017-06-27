import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkUrl(state.url)
      .catch(error => {
        console.log(error);
        return Observable.of(false);
      });
  }

  private checkUrl(url: string): Observable<boolean> {
    return this.authService.isLoggedIn$.map(isLoggedIn => {
      if (isLoggedIn && url === '/login') {
        return false;
      }

      if (!isLoggedIn && url !== '/login') {
        this.authService.redirectUrl = url;
        return false;
      }

      return true;
    });
  }
}