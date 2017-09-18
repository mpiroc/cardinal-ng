import { Injectable } from '@angular/core'
import { Router, NavigationExtras, Event } from '@angular/router'
import { Observable } from 'rxjs/Observable'

export abstract class RouterShimService {
  abstract getEvents(): Observable<Event>
  abstract navigate(commands: any[]): Promise<boolean>
}

@Injectable()
export class RouterShimServiceImplementation extends RouterShimService {
  constructor(private router: Router) {
    super()
  }

  getEvents(): Observable<Event> {
    return this.router.events
  }

  navigate(commands: any[]): Promise<boolean> {
    return this.router.navigate(commands)
  }
}