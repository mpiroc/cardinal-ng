import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { UserActions } from '../../redux/actions/firebase';
import { AuthService } from '../firebase/auth.service';
import { LogService } from '../log.service';

export abstract class AuthGuardService implements CanActivate {
  abstract canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
}

@Injectable()
export class AuthGuardServiceImplementation extends AuthGuardService {
  constructor(
    private authService: AuthService,
    private logService: LogService,
    private userActions: UserActions,
  ) {
    super();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoading$
      .filter(isLoading => !isLoading)
      .switchMap(_ => this.authService.isLoggedIn$)
      .catch(error => {
        this.logService.error(error);
        return Observable.of(this.userActions.error({}, error.message));
      });
  }
}
