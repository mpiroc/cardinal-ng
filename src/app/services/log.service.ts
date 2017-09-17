import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { environment } from '../../environments/environment'

export abstract class LogService {
  abstract error$: Observable<any>
  abstract error(message: any): void
}

@Injectable()
export class LogServiceImplementation extends LogService {
  private errorSubject: Subject<any> = new Subject<any>()

  get error$(): Observable<any> {
    return this.errorSubject.asObservable()
  }

  constructor() {
    super()
    this.error$.subscribe(message => console.error(message))
  }

  error(message: any): void {
    this.errorSubject.next(message)
  }
}
