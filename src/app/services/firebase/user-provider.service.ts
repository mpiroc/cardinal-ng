import { Injectable } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import { IUser } from '../../interfaces/firebase'

export abstract class UserProviderService {
  abstract getUser(): Observable<IUser>;
}

@Injectable()
export class UserProviderServiceImplementation extends UserProviderService {
  constructor(private afAuth: AngularFireAuth) {
    super()
  }

  getUser(): Observable<IUser> {
    return this.afAuth.authState.map(user => user ? { uid: user.uid } as IUser : null);
  }
}