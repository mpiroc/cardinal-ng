import { Injectable, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class DatabaseService {
  decks: FirebaseListObservable<any[]>;

  constructor(private database: AngularFireDatabase) {
  }

  getDecks(uid: string): FirebaseListObservable<any[]> {
    if (!uid) {
      console.log('uid: ' + uid);
      return null;
    }

    return this.database.list(`userDecks/${uid}`);
  }
}