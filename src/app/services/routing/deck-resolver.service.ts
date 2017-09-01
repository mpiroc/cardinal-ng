import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { IState } from '../../redux/state';
import { IDeck } from '../../interfaces/firebase';

@Injectable()
export class DeckResolver implements Resolve<IDeck> {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IDeck {
    const deckId: string = route.paramMap.get('deckId');

    // The AuthGuard will prevent this route from being resolved if the user is not logged in, so this is safe.
    const uid: string = this.ngRedux.getState().user.get("data").get("uid");

    return {
      uid,
      deckId,
    };
  }
}