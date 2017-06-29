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
    return this.database.list(`userDecks/${uid}`);
  }

  getDeckCards(uid: string, deckId: string): FirebaseListObservable<any[]> {
    console.log(`Fetching 'deckCards/${uid}/${deckId}'`);
    return this.database.list(`deckCards/${uid}/${deckId}`);
  }
}