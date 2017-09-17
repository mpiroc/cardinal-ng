import { Injectable } from '@angular/core'
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'
import { NgRedux } from '@angular-redux/store'

import { UserResolver } from './user-resolver.service'
import { IState } from '../../redux/state'
import { IDeck } from '../../interfaces/firebase'

export abstract class DeckResolver implements Resolve<IDeck> {
  abstract resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IDeck
}

@Injectable()
export class DeckResolverImplementation implements Resolve<IDeck> {
  constructor(
    private ngRedux: NgRedux<IState>,
    private userResolver: UserResolver
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IDeck {
    const user = this.userResolver.resolve(route, state)
    const deckId: string = route.paramMap.get('deckId')

    return {
      ...user,
      deckId,
    }
  }
}
