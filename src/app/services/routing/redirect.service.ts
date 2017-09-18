import { Injectable } from '@angular/core'
import { NgRedux, select } from '@angular-redux/store'
import { GuardsCheckStart } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'

import { AuthService } from '../firebase/auth.service'
import { RouterShimService } from './router-shim.service'

export abstract class RedirectService {
  abstract startListening()
}

@Injectable()
export class RedirectServiceImplementation extends RedirectService {
  private readonly publicUrls: string[] = [
    '/sign-in',
    '/sign-up',
    '/reset-password',
    '/reset-password-confirmation',
  ]

  constructor(private routerShimService: RouterShimService, private authService: AuthService) {
    super()
  }

  startListening(): Subscription {
    return this.routerShimService.getEvents()
      .filter(event => event instanceof GuardsCheckStart)
      .map(event => (event as GuardsCheckStart).url)
      .switchMap(url => this.authService.isLoading$
        .filter(isLoading => !isLoading)
        .switchMap(isLoading => this.authService.isLoggedIn$)
        .map(isLoggedIn => ({ url, isLoggedIn }))
      ).subscribe(result => this.redirect(result.url, result.isLoggedIn))
  }

  private redirect(url: string, isLoggedIn: boolean) {
    const isUrlPublic: boolean = !!this.publicUrls
      .find(publicUrl => url.startsWith(publicUrl))

    if (isLoggedIn && isUrlPublic) {
      this.routerShimService.navigate(['/decks'])
    }

    if (!isLoggedIn && !isUrlPublic) {
      this.routerShimService.navigate(['/sign-in'])
    }
  }
}
