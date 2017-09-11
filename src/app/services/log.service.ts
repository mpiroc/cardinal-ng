import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../environments/environment';

@Injectable()
export class LogService {
  private infoSubject: Subject<any> = new Subject<any>();
  private debugSubject: Subject<any> = new Subject<string>();
  private logSubject: Subject<any> = new Subject<any>();
  private errorSubject: Subject<any> = new Subject<any>();

  get info$(): Observable<any> {
    return this.infoSubject.asObservable();
  }

  get debug$(): Observable<any> {
    return this.infoSubject.asObservable();
  }

  get log$(): Observable<any> {
    return this.infoSubject.asObservable();
  }

  get error$(): Observable<any> {
    return this.infoSubject.asObservable();
  }

  constructor() {
    if (!environment.production) {
      this.info$.subscribe(message => console.info(message));
      this.debug$.subscribe(message => console.debug(message));
      this.log$.subscribe(message => console.log(message));
      this.error$.subscribe(message => console.error(message));
    }
  }

  info(message: any): void {
    this.infoSubject.next(message);
  }

  debug(message: any): void {
    this.debugSubject.next(message);
  }

  log(message: any): void {
    this.logSubject.next(message);
  }

  error(message: any): void {
    this.errorSubject.next(message);
  }
}
