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
import { auth } from 'firebase/app'
import { Action } from 'redux'
import { NgRedux } from '@angular-redux/store'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/first'
import 'rxjs/add/operator/toPromise'
import { UserActions } from '../../../redux/actions/firebase'
import { NgReduxExtension } from '../../../redux/epics/specs/ng-redux-extension'
import { IState } from '../../../redux/state'
import { AuthService, AuthServiceImplementation } from '../auth.service'
import { AuthShimService, AuthShimServiceImplementation } from '../auth-shim.service'
import {
  signInSubmit,
  signInSubmitSuccess,
  signInSubmitUserError,
  signInSubmitPasswordError,
  signInSubmitProviderError,
} from '../../../redux/actions/sign-in'
import {
  signUpSubmit,
  signUpSubmitSuccess,
  signUpSubmitUserError,
  signUpSubmitPasswordError,
  signUpSubmitProviderError,
} from '../../../redux/actions/sign-up'

class TestAuthError extends Error {
  constructor(message: string, private code: string) {
    super(message)
  }
}

function expectEqual<T>(actual: T[], expected: T[]) {
  expect(actual.length).toEqual(expected.length)

  const maxLength = Math.max(actual.length, expected.length)
  for (let i = 0; i < maxLength; i++) {
    expect(actual[i]).toEqual(expected[i])
  }
}

describe('services', () => {
  describe('AuthService', () => {
    let actions: Action[]
    let authShimServiceMock: AuthShimService
    let userActions: UserActions
    let ngReduxMock: NgRedux<IState>
    let isLoadingSubject: Subject<boolean>
    let uidSubject: Subject<string>
    let authService: AuthService

    beforeEach(() => {
      actions = []

      authShimServiceMock = mock(AuthShimServiceImplementation)
      ngReduxMock = mock(NgReduxExtension)
      userActions = new UserActions()

      isLoadingSubject = new Subject<boolean>()
      uidSubject = new Subject<string>()
      when(ngReduxMock.select(deepEqual(['user', 'isLoading']))).thenReturn(isLoadingSubject)
      when(ngReduxMock.select(deepEqual(['user', 'data', 'uid']))).thenReturn(uidSubject)
      when(ngReduxMock.dispatch(anything())).thenCall(action => actions.push(action))

      authService = new AuthServiceImplementation(
        instance(authShimServiceMock),
        instance(ngReduxMock),
        userActions,
      )
    })

    describe('isLoading$', () => {
      it('takes value directly from redux store', async (done) => {
        const isLoadingPromise: Promise<boolean> = authService.isLoading$.toPromise()

        isLoadingSubject.next(true)
        isLoadingSubject.complete()

        const isLoading: boolean = await isLoadingPromise
        expect(isLoading).toEqual(true)

        done()
      })
    })

    describe('isLoggedIn$', () => {
      it('is true if uid is truthy', async (done) => {
        const isLoggedInPromise: Promise<boolean> = authService.isLoggedIn$.toPromise()

        uidSubject.next('myUid')
        uidSubject.complete()

        const isLoggedIn: boolean = await isLoggedInPromise
        expect(isLoggedIn).toEqual(true)

        done()
      })

      it('is false if uid is falsy', async (done) => {
        const isLoggedInPromise: Promise<boolean> = authService.isLoggedIn$.toPromise()

        uidSubject.next(null)
        uidSubject.complete()

        const isLoggedIn: boolean = await isLoggedInPromise
        expect(isLoggedIn).toEqual(false)

        done()
      })
    })

    describe('signInWithProvider', () => {
      it('dispatches expected actions on success', async (done) => {
        await authService.signInWithGoogle()

        expectEqual(actions, [
          signInSubmit(),
          userActions.setIsLoading({}, true),
          signInSubmitSuccess(),
        ])

        done()
      })

      it('dispatches expected actions on failure', async (done) => {
        when(authShimServiceMock.signInWithPopup(anything())).thenThrow(new Error('myError'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signInWithGoogle()

        expectEqual(actions, [
          signInSubmit(),
          userActions.setIsLoading({}, true),
          signInSubmitProviderError('myError'),
        ])

        done()
      })
    })

    describe('signInWithGoogle', () => {
      it('signs in with popup', async (done) => {
        await authService.signInWithGoogle()

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()
        verify(authShimServiceMock.signInWithPopup(anyOfClass(auth.GoogleAuthProvider))).once()

        done()
      })
    })

    describe('signInWithFacebook', () => {
      it('signs in with popup', async (done) => {
        await authService.signInWithFacebook()

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()
        verify(authShimServiceMock.signInWithPopup(anyOfClass(auth.FacebookAuthProvider))).once()

        done()
      })
    })

    describe('signInWithTwitter', () => {
      it('signs in with popup', async (done) => {
        await authService.signInWithTwitter()

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()
        verify(authShimServiceMock.signInWithPopup(anyOfClass(auth.TwitterAuthProvider))).once()

        done()
      })
    })

    describe('signInWithEmail', () => {
      it('signs in with email and password', async (done) => {
        await authService.signInWithEmail('myEmail', 'myPassword', true)

        verify(authShimServiceMock.signInWithEmailAndPassword('myEmail', 'myPassword')).once()

        done()
      })

      it('sets local persistence if rememberMe is true', async (done) => {
        await authService.signInWithEmail('myEmail', 'myPassword', true)

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()

        done()
      })

      it('sets session persistence if rememberMe is false', async (done) => {
        await authService.signInWithEmail('myEmail', 'myPassword', false)

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.SESSION)).once()

        done()
      })

      it('dispatches expected actions on success', async (done) => {
        await authService.signInWithEmail('myEmail', 'myPassword', true)

        expectEqual(actions, [
          signInSubmit(),
          userActions.setIsLoading({}, true),
          signInSubmitSuccess(),
        ])

        done()
      })

      it('logs auth/user-not-found as user error with custom message', async (done) => {
        when(authShimServiceMock.signInWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'auth/user-not-found'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signInWithEmail('myEmail', 'myPassword', true)

        expectEqual(actions, [
          signInSubmit(),
          userActions.setIsLoading({}, true),
          signInSubmitUserError('There is no user with this email address.'),
        ])

        done()
      })

      it('logs auth/user-disabled as user error with custom message', async (done) => {
        when(authShimServiceMock.signInWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'auth/user-disabled'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signInWithEmail('myEmail', 'myPassword', true)

        expectEqual(actions, [
          signInSubmit(),
          userActions.setIsLoading({}, true),
          signInSubmitUserError('The user with this email address has been disabled.'),
        ])

        done()
      })

      it('logs auth/wrong-password as password error with custom message', async (done) => {
        when(authShimServiceMock.signInWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'auth/wrong-password'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signInWithEmail('myEmail', 'myPassword', true)

        expectEqual(actions, [
          signInSubmit(),
          userActions.setIsLoading({}, true),
          signInSubmitPasswordError('Invalid password'),
        ])

        done()
      })

      it('logs all other auth errors as password errors', async (done) => {
        when(authShimServiceMock.signInWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'myCode'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signInWithEmail('myEmail', 'myPassword', true)

        expectEqual(actions, [
          signInSubmit(),
          userActions.setIsLoading({}, true),
          signInSubmitPasswordError('myError'),
        ])

        done()
      })
    })

    describe('signUpWithProvider', () => {
      it('dispatches expected actions on success', async (done) => {
        await authService.signUpWithGoogle()

        expectEqual(actions, [
          signUpSubmit(),
          userActions.setIsLoading({}, true),
          signUpSubmitSuccess(),
        ])

        done()
      })

      it('dispatches expected actions on failure', async (done) => {
        when(authShimServiceMock.signInWithPopup(anything())).thenThrow(new Error('myError'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signUpWithGoogle()

        expectEqual(actions, [
          signUpSubmit(),
          userActions.setIsLoading({}, true),
          signUpSubmitProviderError('myError'),
        ])

        done()
      })
    })

    describe('signUpWithGoogle', () => {
      it('signs in with popup', async (done) => {
        await authService.signInWithGoogle()

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()
        verify(authShimServiceMock.signInWithPopup(anyOfClass(auth.GoogleAuthProvider))).once()

        done()
      })
    })

    describe('signUpWithFacebook', () => {
      it('signs in with popup', async (done) => {
        await authService.signInWithFacebook()

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()
        verify(authShimServiceMock.signInWithPopup(anyOfClass(auth.FacebookAuthProvider))).once()

        done()
      })
    })

    describe('signUpWithTwitter', () => {
      it('signs in with popup', async (done) => {
        await authService.signInWithTwitter()

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()
        verify(authShimServiceMock.signInWithPopup(anyOfClass(auth.TwitterAuthProvider))).once()

        done()
      })
    })

    describe('signUpWithEmail', () => {
      it('signs up with email', async (done) => {
        await authService.signUpWithEmail('myEmail', 'myPassword')

        verify(authShimServiceMock.setPersistence(auth.Auth.Persistence.LOCAL)).once()
        verify(authShimServiceMock.createUserWithEmailAndPassword('myEmail', 'myPassword')).once()

        done()
      })

      it('dispatches expected actions on success', async (done) => {
        await authService.signUpWithEmail('myEmail', 'myPassword')

        expectEqual(actions, [
          signUpSubmit(),
          userActions.setIsLoading({}, true),
          signUpSubmitSuccess(),
        ])

        done()
      })

      it('logs auth/user-not-found as user error with custom message', async (done) => {
        when(authShimServiceMock.createUserWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'auth/user-not-found'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signUpWithEmail('myEmail', 'myPassword')

        expectEqual(actions, [
          signUpSubmit(),
          userActions.setIsLoading({}, true),
          signUpSubmitUserError('There is no user with this email address.'),
        ])

        done()
      })

      it('logs auth/user-disabled as user error with custom message', async (done) => {
        when(authShimServiceMock.createUserWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'auth/user-disabled'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signUpWithEmail('myEmail', 'myPassword')

        expectEqual(actions, [
          signUpSubmit(),
          userActions.setIsLoading({}, true),
          signUpSubmitUserError('The user with this email address has been disabled.'),
        ])

        done()
      })

      it('logs auth/wrong-password as password error with custom message', async (done) => {
        when(authShimServiceMock.createUserWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'auth/wrong-password'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signUpWithEmail('myEmail', 'myPassword')

        expectEqual(actions, [
          signUpSubmit(),
          userActions.setIsLoading({}, true),
          signUpSubmitPasswordError('Invalid password'),
        ])

        done()
      })

      it('logs all other auth errors as password errors', async (done) => {
        when(authShimServiceMock.createUserWithEmailAndPassword(anyString(), anyString()))
          .thenThrow(new TestAuthError('myError', 'myCode'))
        const authService: AuthService = new AuthServiceImplementation(
          instance(authShimServiceMock),
          instance(ngReduxMock),
          userActions,
        )

        await authService.signUpWithEmail('myEmail', 'myPassword')

        expectEqual(actions, [
          signUpSubmit(),
          userActions.setIsLoading({}, true),
          signUpSubmitPasswordError('myError'),
        ])

        done()
      })
    })

    describe('signOut', () => {
      it('signs out', async (done) => {
        await authService.signOut()

        verify(authShimServiceMock.signOut()).once()

        done()
      })
    })

    describe('resetPassword', () => {
      it('resets password', async (done) => {
        await authService.resetPassword('myEmail')

        verify(authShimServiceMock.sendPasswordResetEmail('myEmail')).once()

        done()
      })
    })
  })
})