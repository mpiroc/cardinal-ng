import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { IState } from '../redux/state';
import { IDeck } from '../interfaces/firebase';

@Injectable()
export class DeckResolver implements Resolve<IDeck> {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDeck> {
    const deckId: string = route.paramMap.get('deckId');

    return this.ngRedux
      .select<string>(["user", "data", "uid"])
      .map(uid => ({
        uid,
        deckId,
      }))
      .first();
  }
}