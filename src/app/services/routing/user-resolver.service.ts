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
    // The AuthGuard will prevent this route from being resolved if the user is not logged in, so this is safe.
    const uid: string = this.ngRedux.getState().user.get("data").get("uid");

    return {
      uid,
    };
  }
}