import { Map } from 'immutable'
import { NgRedux } from '@angular-redux/store'

import { IState } from '../../../redux/state'
import { NgReduxExtension } from '../../../utils/test-utils.spec'
import { UserResolver, UserResolverImplementation } from '../user-resolver.service'

import {
  instance,
  mock,
  when,
} from 'ts-mockito'

describe('services', () => {
  describe('UserResolverService', () => {
    it('fetches uid from redux store', () => {
      const ngReduxMock = mock(NgReduxExtension)
      when(ngReduxMock.getState()).thenReturn({
        user: Map<string, any>({
          data: Map<string, any>({
            uid: 'myUid',
          })
        })
      })

      const userResolver: UserResolver = new UserResolverImplementation(instance(ngReduxMock))
      const user = userResolver.resolve(null, null)

      expect(user).toEqual({
        uid: 'myUid'
      })
    })
  })
})
