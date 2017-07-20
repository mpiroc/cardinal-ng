import { Injectable, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Promise } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import * as fb from '../models/firebase-models';


@Injectable()
export class DatabaseService {
  constructor(private database: AngularFireDatabase) {
  }

  getDecks(uid: string): Observable<fb.IUserDeck[]> {
    return this.database.list(`userDeck/${uid}`);
  }

  getDeckInfo(uid: string, deckId: string): Observable<fb.IDeckInfo> {
    return this.database.object(`deckInfo/${uid}/${deckId}`);
  }

  getDeckCards(uid: string, deckId: string): Observable<fb.IDeckCard[]> {
    return this.database.list(`deckCard/${uid}/${deckId}`);
  }

  getCardContent(uid: string, deckId: string, cardId: string): Observable<fb.ICardContent> {
    return this.database.object(`cardContent/${uid}/${deckId}/${cardId}`);
  }

  updateUserDeck(uid: string, deckId: string, data: any): Promise<void> {
    return this.database.object(`userDeck/${uid}/${deckId}`).update(data);
  }
}