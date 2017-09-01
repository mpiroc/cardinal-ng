import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { IState } from '../../redux/state';
import { IUser } from '../../interfaces/firebase';

@Injectable()
export class UserResolver implements Resolve<IUser> {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : IUser {
    // This resolver should only be used with routes that use AuthGuard.
    // This will prevent this route from being resolved if the user is
    // not logged in, so it's safe to synchronously fetch the uid from
    // the redux store.
    const uid: string = this.ngRedux.getState().user.get("data").get("uid");

    return {
      uid,
    };
  }
}