import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import {
  AngularFireDatabase,
  FirebaseOperation,
} from 'angularfire2/database'
import {
  PathReference,
  FirebaseListFactoryOpts,
  FirebaseObjectFactoryOpts,

} from 'angularfire2/database/interfaces'

export interface IFirebaseObjectObservable {
  update(value: Object): firebase.Promise<void>;
  remove(): firebase.Promise<void>;
}

export interface IFirebaseListObservable {
  update(item: FirebaseOperation, value: Object): firebase.Promise<void>;
  remove(item?: FirebaseOperation): firebase.Promise<void>;
  push(val: any): firebase.Thenable<{ key: string }>;
}

export abstract class DatabaseShimService {
  abstract list(pathOrRef: PathReference, opts?: FirebaseListFactoryOpts): IFirebaseListObservable & Observable<any[]>;
  abstract object(pathOrRef: PathReference, opts?: FirebaseObjectFactoryOpts): IFirebaseObjectObservable & Observable<any>;
}

@Injectable()
export class DatabaseShimServiceImplementation extends DatabaseShimService {
  constructor(private database: AngularFireDatabase) {
    super();
  }

  list(pathOrRef: PathReference, opts?: FirebaseListFactoryOpts): IFirebaseListObservable & Observable<any[]> {
    return this.database.list(pathOrRef, opts)
  }

  object(pathOrRef: PathReference, opts?: FirebaseObjectFactoryOpts): IFirebaseObjectObservable & Observable<any> {
    return this.database.object(pathOrRef, opts)
  }
}
