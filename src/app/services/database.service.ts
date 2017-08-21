import { Injectable, Input } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';
import { database } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import * as fb from '../models/firebase-models';


@Injectable()
export class DatabaseService {
  constructor(private database: AngularFireDatabase) {
  }

  // Create
  async createDeck(uid: string): firebase.Promise<void> {
    const userDeck: fb.IUserDeck = await this.getUserDecks(uid).push({
      uid,
    });

    await this.getDeckInfo(uid, userDeck.$key).set({
      uid,
      name: "",
      description: "",
    });
  }

  async createCard(uid: string, deckId: string): firebase.Promise<void> {
    const deckCard: fb.IDeckCard = await this.getDeckCards(uid, deckId).push({
      uid,
      deckId,
    });

    const cardContent: firebase.Promise<void> =
      this.getCardContent(uid, deckId, deckCard.$key).set({
        uid,
        deckId,
        front: "",
        back: "",
      });

    const cardHistory: firebase.Promise<void> =
      this.getCardHistory(uid, deckId, deckCard.$key).set({
        uid,
        deckId,
        difficulty: 2.5,
        grade: 0,
        repetitions: 0,
      });

    await firebase.Promise.all([cardContent, cardHistory]);
  }

  // Retrieve
  getUserDecks(uid: string): FirebaseListObservable<fb.IUserDeck[]> {
    return this.database.list(this.getUserDeckPath(uid));
  }

  getDeckInfo(uid: string, deckId: string): FirebaseObjectObservable<fb.IDeckInfo> {
    return this.database.object(`${this.getDeckInfoPath(uid)}/${deckId}`);
  }

  getDeckCards(uid: string, deckId: string): FirebaseListObservable<fb.IDeckCard[]> {
    return this.database.list(this.getDeckCardPath(uid, deckId));
  }

  getCardContent(uid: string, deckId: string, cardId: string): FirebaseObjectObservable<fb.ICardContent> {
    return this.database.object(`${this.getCardContentPath(uid, deckId)}/${cardId}`);
  }

  getCardHistory(uid: string, deckId: string, cardId: string): FirebaseObjectObservable<fb.ICardHistory> {
    return this.database.object(`${this.getCardHistoryPath(uid, deckId)}/${cardId}`);
  }

  // Update
  updateDeckInfo(uid: string, deckId: string,
    name: string, description: string)
    : firebase.Promise<void> {

    return this.getDeckInfo(uid, deckId).update({
      name,
      description,
    });
  }

  updateCardContent(uid: string, deckId: string, cardId: string,
    front: string, back: string)
    : firebase.Promise<void> {

    return this.getCardContent(uid, deckId, cardId).update({
      front,
      back,
    });
  }

  updateCardHistory(uid: string, deckId: string, cardId: string,
    difficulty: number, grade: number, repetitions: number)
    : firebase.Promise<void> {

    return this.getCardHistory(uid, deckId, cardId).update({
      difficulty,
      grade,
      repetitions,
    });
  }

  // Delete
  deleteDeck(uid: string, deckId: string): firebase.Promise<any[]> {
    return firebase.Promise.all([
      this.getUserDecks(uid).remove(deckId),
      this.database.list(this.getDeckInfoPath(uid)).remove(deckId),
    ]);
  }

  async deleteCard(uid: string, deckId: string, cardId: string): firebase.Promise<any[]> {
    return firebase.Promise.all([
      this.getDeckCards(uid, deckId).remove(cardId),
      this.database.list(this.getCardContentPath(uid, deckId)).remove(cardId),
      this.database.list(this.getCardHistoryPath(uid, deckId)).remove(cardId),
    ]);
  }

  // Helpers
  private getUserDeckPath(uid: string): string {
    return `userDeck/${uid}`;
  }

  private getDeckInfoPath(uid: string): string {
    return `deckInfo/${uid}`;
  }

  private getDeckCardPath(uid: string, deckId: string): string {
    return `deckCard/${uid}/${deckId}`;
  }

  private getCardContentPath(uid: string, deckId: string): string {
    return `cardContent/${uid}/${deckId}`;
  }

  private getCardHistoryPath(uid: string, deckId: string): string {
    return `cardHistory/${uid}/${deckId}`;
  }
}