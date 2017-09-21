import { Map } from 'immutable'
import { ActivatedRouteSnapshot, ParamMap } from '@angular/router'
import { UserResolver, UserResolverImplementation } from '../user-resolver.service'
import { DeckResolver, DeckResolverImplementation } from '../deck-resolver.service'

import {
  instance,
  mock,
  when,
  anything,
} from 'ts-mockito'

class ParamMapExtension implements ParamMap {
  readonly keys: string[]
  has(name: string): boolean { return null }
  get(name: string): string | null { return null }
  getAll(name: string): string[] { return null }
}

describe('services', () => {
  describe('DeckResolverService', () => {
    it('fetches uid from user resolver', () => {
      const userResolverMock = mock(UserResolverImplementation)
      when(userResolverMock.resolve(anything(), null)).thenReturn({
        uid: 'myUid',
      })
      const paramMapMock = mock(ParamMapExtension)

      const deckResolver: DeckResolver = new DeckResolverImplementation(instance(userResolverMock))
      const deck = deckResolver.resolve({ paramMap: instance(paramMapMock) }, null)

      expect(deck.uid).toEqual('myUid')
    })

    it('fetches deckId from route params', () => {
      const userResolverMock = mock(UserResolverImplementation)
      when(userResolverMock.resolve(anything(), null)).thenReturn({
        uid: 'myUid',
      })
      const paramMapMock = mock(ParamMapExtension)
      when(paramMapMock.get('deckId')).thenReturn('myDeckId')

      const deckResolver: DeckResolver = new DeckResolverImplementation(instance(userResolverMock))
      const deck = deckResolver.resolve({ paramMap: instance(paramMapMock) }, null)

      expect(deck.deckId).toEqual('myDeckId')
    })
  })
})
