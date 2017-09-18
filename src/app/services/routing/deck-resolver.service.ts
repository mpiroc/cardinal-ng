import { Injectable } from '@angular/core'
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ParamMap,
} from '@angular/router'

import { UserResolver } from './user-resolver.service'
import { IDeck } from '../../interfaces/firebase'

interface IHasParamMap {
  paramMap: ParamMap
}

export abstract class DeckResolver implements Resolve<IDeck> {
  abstract resolve(route: IHasParamMap, state: any): IDeck
}

@Injectable()
export class DeckResolverImplementation extends DeckResolver {
  constructor(private userResolver: UserResolver) {
    super()
  }

  resolve(route: IHasParamMap, state: any): IDeck {
    const user = this.userResolver.resolve(route, state)
    const deckId: string = route.paramMap.get('deckId')

    return {
      ...user,
      deckId,
    }
  }
}
