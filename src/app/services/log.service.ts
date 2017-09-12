import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../environments/environment';

@Injectable()
export class LogService {
  private errorSubject: Subject<any> = new Subject<any>();

  get error$(): Observable<any> {
    return this.errorSubject.asObservable();
  }

  constructor() {
    this.error$.subscribe(message => console.error(message));
  }

  error(message: any): void {
    this.errorSubject.next(message);
  }
}
