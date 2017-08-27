import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import { IState } from '../redux/state';
import { IUserDeck } from '../models/firebase-models';

@Injectable()
export class DeckResolver implements Resolve<IUserDeck> {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUserDeck> {
    const deckId: string = route.paramMap.get('deckId');

    return this.ngRedux
      .select<string>(["user", "data", "uid"])
      .map(uid => ({
        uid,
        $key: deckId,
      }))
      .first();
  }
}