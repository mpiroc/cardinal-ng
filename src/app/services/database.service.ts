import { Injectable, Input } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseObjectObservable,
  FirebaseListObservable,
} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import * as fb from '../models/firebase-models';

@Injectable()
export class DatabaseService {
  constructor(private database: AngularFireDatabase) {
  }

  getDecks(uid: string): FirebaseListObservable<fb.IUserDeck[]> {
    return this.database.list(`userDecks/${uid}`);
  }

  getDeckCards(uid: string, deckId: string): FirebaseListObservable<fb.IDeckCard[]> {
    return this.database.list(`deckCards/${uid}/${deckId}`);
  }

  getCardContent(uid: string, deckId: string, cardId: string): FirebaseObjectObservable<fb.ICardContent> {
    return this.database.object(`cardContent/${uid}/${deckId}/${cardId}`);
  }
}