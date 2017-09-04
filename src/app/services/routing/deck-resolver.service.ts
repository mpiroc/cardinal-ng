import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { UserResolver } from './user-resolver.service';
import { IState } from '../../redux/state';
import { IDeck } from '../../interfaces/firebase';

@Injectable()
export class DeckResolver implements Resolve<IDeck> {
  constructor(
    private ngRedux: NgRedux<IState>,
    private userResolver: UserResolver
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IDeck {
    const user = this.userResolver.resolve(route, state);
    const deckId: string = route.paramMap.get('deckId');

    return {
      ...user,
      deckId,
    };
  }
}
