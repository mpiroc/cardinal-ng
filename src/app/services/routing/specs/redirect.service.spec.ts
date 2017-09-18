import { Event, NavigationStart, GuardsCheckStart } from '@angular/router'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'

import { AuthService, AuthServiceImplementation } from '../../firebase/auth.service'
import { RouterShimService, RouterShimServiceImplementation } from '../router-shim.service'
import { RedirectService, RedirectServiceImplementation } from '../redirect.service'

import {
  instance,
  mock,
  when,
  verify,
  deepEqual,
  anything,
} from 'ts-mockito'

describe('services', () => {
  describe('RedirectService', () => {
    let authServiceMock: AuthService
    let authService: AuthService
    let isLoadingSubject: Subject<boolean>
    let isLoggedInSubject: Subject<boolean>

    let routerShimServiceMock: RouterShimService
    let eventsSubject: Subject<Event>

    beforeEach(() => {
      authServiceMock = mock(AuthServiceImplementation)
      authService = instance(authServiceMock)
      isLoadingSubject = new Subject<boolean>()
      isLoggedInSubject = new Subject<boolean>()
      authService.isLoading$ = isLoadingSubject
      authService.isLoggedIn$ = isLoggedInSubject

      routerShimServiceMock = mock(RouterShimServiceImplementation)

      eventsSubject = new Subject<Event>()
      when(routerShimServiceMock.getEvents()).thenReturn(eventsSubject)
    })

    it('does not redirect on events other than GuardsCheckStart', () => {
      const redirectService = new RedirectServiceImplementation(
        instance(routerShimServiceMock),
        authService,
      )

      const subscription: Subscription = redirectService.startListening()

      const event = new NavigationStart(null, null)
      eventsSubject.next(event)
      isLoadingSubject.next(false)
      isLoadingSubject.complete()
      isLoggedInSubject.next(true)
      isLoggedInSubject.complete()

      subscription.unsubscribe()

      verify(routerShimServiceMock.navigate(anything())).never()
    })

    it('redirects to sign in page if not logged in and route is protected', () => {
      const redirectService = new RedirectServiceImplementation(
        instance(routerShimServiceMock),
        authServiceMock,
      )

      const subscription: Subscription = redirectService.startListening()

      const event = new GuardsCheckStart(undefined, '/testRoute', undefined, undefined)
      eventsSubject.next(event)
      isLoadingSubject.next(false)
      isLoadingSubject.complete()
      isLoggedInSubject.next(false)
      isLoggedInSubject.complete()

      subscription.unsubscribe()

      verify(routerShimServiceMock.navigate([ '/sign-in' ])).once()
    })

    it('redirects to decks route if logged in and route is not protected', () => {
      const redirectService = new RedirectServiceImplementation(
        instance(routerShimServiceMock),
        instance(authServiceMock),
      )

      const subscription: Subscription = redirectService.startListening()

      const event = new GuardsCheckStart(undefined, '/sign-in', undefined, undefined)
      eventsSubject.next(event)
      isLoadingSubject.next(false)
      isLoadingSubject.complete()
      isLoggedInSubject.next(true)
      isLoggedInSubject.complete()

      subscription.unsubscribe()

      verify(routerShimServiceMock.navigate([ '/decks' ])).once()
    })

    it('does not redirect if logged in and route is protected', () => {
      const redirectService = new RedirectServiceImplementation(
        instance(routerShimServiceMock),
        instance(authServiceMock),
      )

      const subscription: Subscription = redirectService.startListening()

      const event = new GuardsCheckStart(undefined, '/testRoute', undefined, undefined)
      eventsSubject.next(event)
      isLoadingSubject.next(false)
      isLoadingSubject.complete()
      isLoggedInSubject.next(true)
      isLoggedInSubject.complete()

      subscription.unsubscribe()

      verify(routerShimServiceMock.navigate(anything())).never()
    })

    it('does not redirect if not logged in and route is not protected', () => {
      const redirectService = new RedirectServiceImplementation(
        instance(routerShimServiceMock),
        instance(authServiceMock),
      )

      const subscription: Subscription = redirectService.startListening()

      const event = new GuardsCheckStart(undefined, '/sign-in', undefined, undefined)
      eventsSubject.next(event)
      isLoadingSubject.next(false)
      isLoadingSubject.complete()
      isLoggedInSubject.next(false)
      isLoggedInSubject.complete()

      subscription.unsubscribe()

      verify(routerShimServiceMock.navigate(anything())).never()
    })
  })
})