import { Injectable, Input } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';
import { database } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Promise as FirebasePromise } from 'firebase';
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
  async createDeck(args: IUserArgs, name: string, description: string,) : FirebasePromise<void> {
    const userDeck: { key: string } = await this.getUserDecks(args).push(args);

    const deckArgs: IDeckArgs = {
      ...args,
      deckId: userDeck.key,
    };

    await FirebasePromise.all([
      this.updateUserDeck(deckArgs),
      this.updateDeckInfo(deckArgs, name, description),
    ]);
  }

  async createCard(args: IDeckArgs): FirebasePromise<void> {
    const deckCard: { key: string } = await this.getDeckCards(args).push(args);

    const cardArgs: ICardArgs = {
      ...args,
      cardId: deckCard.key,
    };

    await FirebasePromise.all([
      this.updateDeckCard(cardArgs),
      this.updateCardContent(cardArgs, "", ""),
      this.updateCardHistory(cardArgs, 2.5, 0, 0),
    ]);
  }

  // Retrieve
  getUserDecks(args: IUserArgs): FirebaseListObservable<fb.IUserDeck[]> {
    return this.database.list(this.getUserDeckBasePath(args));
  }

  getUserDeck(args: IDeckArgs): FirebaseObjectObservable<fb.IUserDeck> {
    return this.database.object(this.getUserDeckPath(args));
  }

  getDeckInfo(args: IDeckArgs): FirebaseObjectObservable<fb.IDeckInfo> {
    return this.database.object(this.getDeckInfoPath(args));
  }

  getDeckCards(args: IDeckArgs): FirebaseListObservable<fb.IDeckCard[]> {
    return this.database.list(this.getDeckCardBasePath(args));
  }

  getDeckCard(args: ICardArgs): FirebaseObjectObservable<fb.IDeckCard> {
    return this.database.object(this.getDeckCardPath(args));
  }

  getCardContent(args: ICardArgs) : FirebaseObjectObservable<fb.ICardContent> {
    return this.database.object(this.getCardContentPath(args));
  }

  getCardHistory(args: ICardArgs) : FirebaseObjectObservable<fb.ICardHistory> {
    return this.database.object(this.getCardHistoryPath(args));
  }

  // Update
  updateUserDeck(args: IDeckArgs) : FirebasePromise<void> {
    return this.getUserDeck(args).update({
      ...args,
    });
  }

  updateDeckInfo(args: IDeckArgs, name: string, description: string) : FirebasePromise<void> {
    return this.getDeckInfo(args).update({
      ...args,
      name,
      description,
    });
  }

  updateDeckCard(args: ICardArgs) : FirebasePromise<void> {
    return this.getDeckCard(args).update({
      ...args,
    });
  }

  updateCardContent(args: ICardArgs, front: string, back: string) : FirebasePromise<void> {
    return this.getCardContent(args).update({
      ...args,
      front,
      back,
    });
  }

  updateCardHistory(args: ICardArgs, difficulty: number, grade: number, repetitions: number) : FirebasePromise<void> {
    return this.getCardHistory(args).update({
      ...args,
      difficulty,
      grade,
      repetitions,
    });
  }

  // Delete
  deleteDeck(args: IDeckArgs): FirebasePromise<any[]> {
    return FirebasePromise.all([
      this.getUserDecks(args).remove(args.deckId),
      this.database.list(this.getDeckInfoBasePath(args)).remove(args.deckId),
    ]);
  }

  async deleteCard(args: ICardArgs): FirebasePromise<any[]> {
    return FirebasePromise.all([
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