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

export interface IUserArgs {
  uid: string;
}

export interface IDeckArgs extends IUserArgs {
  deckId: string;
}

export interface ICardArgs extends IDeckArgs {
  cardId: string;
}

@Injectable()
export class DatabaseService {
  constructor(private database: AngularFireDatabase) {
  }

  // Create
  async createDeck(args: IUserArgs, name: string, description: string,): firebase.Promise<void> {
    const userDeck: { key: string } = await this.getUserDecks(args).push(args);

    const deckArgs: IDeckArgs = {
      ...args,
      deckId: userDeck.key,
    };

    await this.getDeckInfo(deckArgs).set({
      ...deckArgs,
      name,
      description,
    });
  }

  async createCard(args: IDeckArgs): firebase.Promise<void> {
    const deckCard: { key: string } = await this.getDeckCards(args).push(args);

    const cardArgs: ICardArgs = {
      ...args,
      cardId: deckCard.key,
    };

    const cardContent: firebase.Promise<void> =
      this.getCardContent(cardArgs).set({
        ...cardArgs,
        front: "",
        back: "",
      });

    const cardHistory: firebase.Promise<void> =
      this.getCardHistory(cardArgs).set({
        ...cardArgs,
        difficulty: 2.5,
        grade: 0,
        repetitions: 0,
      });

    await firebase.Promise.all([cardContent, cardHistory]);
  }

  // Retrieve
  getUserDecks(args: IUserArgs): FirebaseListObservable<fb.IUserDeck[]> {
    return this.database.list(this.getUserDeckBasePath(args));
  }

  getDeckInfo(args: IDeckArgs): FirebaseObjectObservable<fb.IDeckInfo> {
    return this.database.object(this.getDeckInfoPath(args));
  }

  getDeckCards(args: IDeckArgs): FirebaseListObservable<fb.IDeckCard[]> {
    return this.database.list(this.getDeckCardBasePath(args));
  }

  getCardContent(args: ICardArgs): FirebaseObjectObservable<fb.ICardContent> {
    return this.database.object(this.getCardContentPath(args));
  }

  getCardHistory(args: ICardArgs): FirebaseObjectObservable<fb.ICardHistory> {
    return this.database.object(this.getCardHistoryPath(args));
  }

  // Update
  updateDeckInfo(args: IDeckArgs, name: string, description: string) : firebase.Promise<void> {
    return this.getDeckInfo(args).update({
      name,
      description,
    });
  }

  updateCardContent(args: ICardArgs, front: string, back: string) : firebase.Promise<void> {
    return this.getCardContent(args).update({
      front,
      back,
    });
  }

  updateCardHistory(args: ICardArgs, difficulty: number, grade: number, repetitions: number) : firebase.Promise<void> {
    return this.getCardHistory(args).update({
      difficulty,
      grade,
      repetitions,
    });
  }

  // Delete
  deleteDeck(args: IDeckArgs): firebase.Promise<any[]> {
    return firebase.Promise.all([
      this.getUserDecks(args).remove(args.deckId),
      this.database.list(this.getDeckInfoBasePath(args)).remove(args.deckId),
    ]);
  }

  async deleteCard(args: ICardArgs): firebase.Promise<any[]> {
    return firebase.Promise.all([
      this.getDeckCards(args).remove(args.cardId),
      this.database.list(this.getCardContentBasePath(args)).remove(args.cardId),
      this.database.list(this.getCardHistoryBasePath(args)).remove(args.cardId),
    ]);
  }

  // Base path helpers
  private getUserDeckBasePath(args: IUserArgs): string {
    return `userDeck/${args.uid}`;
  }

  private getDeckInfoBasePath(args: IUserArgs): string {
    return `deckInfo/${args.uid}`;
  }

  private getDeckCardBasePath(args: IDeckArgs): string {
    return `deckCard/${args.uid}/${args.deckId}`;
  }

  private getCardContentBasePath(args: IDeckArgs): string {
    return `cardContent/${args.uid}/${args.deckId}`;
  }

  private getCardHistoryBasePath(args: IDeckArgs): string {
    return `cardHistory/${args.uid}/${args.deckId}`;
  }

  // Full path helpers
  private getUserDeckPath(args: IDeckArgs): string {
    return `${this.getUserDeckBasePath(args)}/${args.deckId}`;
  }

  private getDeckInfoPath(args: IDeckArgs): string {
    return `${this.getDeckInfoBasePath(args)}/${args.deckId}`;
  }

  private getDeckCardPath(args: ICardArgs): string {
    return `${this.getDeckCardBasePath(args)}/${args.cardId}`;
  }

  private getCardContentPath(args: ICardArgs): string {
    return `${this.getCardContentBasePath(args)}/${args.cardId}`;
  }

  private getCardHistoryPath(args: ICardArgs): string {
    return `${this.getCardHistoryBasePath(args)}/${args.cardId}`;
  }
}