import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/toPromise'
import { NgRedux } from '@angular-redux/store'

import { IState } from '../../../redux/state'
import { UserActions } from '../../../redux/actions/firebase'
import { AuthService, AuthServiceImplementation } from '../../firebase/auth.service'
import { LogService, LogServiceImplementation } from '../../log.service'
import { AuthGuardService, AuthGuardServiceImplementation } from '../auth-guard.service'
import {
  expectEqual,
  NgReduxExtension,
} from '../../../utils/test-utils.spec'

import {
  instance,
  mock,
  verify,
  when,
  deepEqual,
  anything,
  anyOfClass,
  anyString,
} from 'ts-mockito'

describe('services', () => {
  describe('AuthGuardService', () => {
    let errorMessages: string[]
    let userActions: UserActions

    let ngReduxMock: NgRedux<IState>
    let authServiceMock: AuthService
    let authService: AuthService
    let logServiceMock: LogService

    let isLoadingSubject: Subject<boolean>
    let isLoggedInSubject: Subject<boolean>

    beforeEach(() => {
      errorMessages = []

      isLoadingSubject = new Subject<boolean>()
      isLoggedInSubject = new Subject<boolean>()
      authServiceMock = mock(AuthServiceImplementation)
      authService = instance(authServiceMock)
      authService.isLoading$ = isLoadingSubject
      authService.isLoggedIn$ = isLoggedInSubject

      userActions = new UserActions()
      ngReduxMock = mock(NgReduxExtension)

      logServiceMock = mock(LogServiceImplementation)
      when(logServiceMock.error(anyString())).thenCall(message => errorMessages.push(message))
    })

    it('ignores isLoggedIn events until finished loading', async (done) => {
      const authGuardService: AuthGuardService = new AuthGuardServiceImplementation(
        instance(authServiceMock),
        instance(logServiceMock),
        instance(ngReduxMock),
        userActions);

      const promise = authGuardService.canActivate(null, null).toPromise()

      isLoggedInSubject.error(new Error('myError'))
      isLoggedInSubject.complete()
      isLoadingSubject.complete()

      const canActivate = await promise

      expectEqual(errorMessages, [])
      verify(ngReduxMock.dispatch(anything())).never()

      done()
    })

    it('allows logged in users to access the route', async (done) => {
      const authGuardService: AuthGuardService = new AuthGuardServiceImplementation(
        instance(authServiceMock),
        instance(logServiceMock),
        instance(ngReduxMock),
        userActions);

      const promise = authGuardService.canActivate(null, null).toPromise()

      isLoadingSubject.next(true)
      isLoadingSubject.next(false)
      isLoggedInSubject.next(true)
      isLoggedInSubject.complete()
      isLoadingSubject.complete()

      const canActivate = await promise

      expectEqual(errorMessages, [])
      expect(canActivate).toEqual(true)

      done()
    })

    it('blocks anonymous users from accessing the route', async (done) => {
      const authGuardService: AuthGuardService = new AuthGuardServiceImplementation(
        instance(authServiceMock),
        instance(logServiceMock),
        instance(ngReduxMock),
        userActions)

      const promise = authGuardService.canActivate(null, null).toPromise()

      isLoadingSubject.next(true)
      isLoadingSubject.next(false)
      isLoadingSubject.complete()
      isLoggedInSubject.next(false)
      isLoggedInSubject.complete()

      const canActivate = await promise

      expectEqual(errorMessages, [])
      expect(canActivate).toEqual(false)

      done()
    })

    it('catches and logs isLoading errors', async (done) => {
      const authGuardService: AuthGuardService = new AuthGuardServiceImplementation(
        instance(authServiceMock),
        instance(logServiceMock),
        instance(ngReduxMock),
        userActions);

      const promise = authGuardService.canActivate(null, null).toPromise()

      isLoadingSubject.error(new Error('myError'))
      isLoadingSubject.complete()
      isLoggedInSubject.complete()

      const canActivate = await promise

      expectEqual(errorMessages, [ 'myError' ])
      verify(ngReduxMock.dispatch(deepEqual(userActions.error({}, 'myError')))).once()
      expect(canActivate).toEqual(false)

      done()
    })

    it('catches and logs isLoggedIn errors', async (done) => {
      const authGuardService: AuthGuardService = new AuthGuardServiceImplementation(
        instance(authServiceMock),
        instance(logServiceMock),
        instance(ngReduxMock),
        userActions);

      const promise = authGuardService.canActivate(null, null).toPromise()

      isLoadingSubject.next(false)
      isLoadingSubject.complete()
      isLoggedInSubject.error(new Error('myError'))
      isLoggedInSubject.complete()

      const canActivate = await promise

      expectEqual(errorMessages, [ 'myError' ])
      verify(ngReduxMock.dispatch(deepEqual(userActions.error({}, 'myError')))).once()
      expect(canActivate).toEqual(false)

      done()
    })
  })
})
