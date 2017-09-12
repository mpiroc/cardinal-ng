import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { IState } from '../../redux/state';
import { IUser } from '../../interfaces/firebase';

export abstract class UserResolver implements Resolve<IUser> {
  abstract resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IUser;
}

@Injectable()
export class UserResolverImplementation extends UserResolver {
  constructor(private ngRedux: NgRedux<IState>) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IUser {
    // This resolver should only be used with routes that use AuthGuard.
    // This will prevent this route from being resolved if the user is
    // not logged in, so it's safe to synchronously fetch the uid from
    // the redux store.
    const uid: string = this.ngRedux.getState().user.get('data').get('uid');

    return {
      uid,
    };
  }
}
