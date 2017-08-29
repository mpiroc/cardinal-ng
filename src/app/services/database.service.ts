import { Injectable, Input } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';
import {
  database,
  Promise as FirebasePromise,
} from 'firebase';

import { AuthService } from './auth.service';
import {
  IUserArgs,
  IDeckArgs,
  ICardArgs,
  IDeck,
  IDeckInfo,
  ICard,
  ICardContent,
  ICardHistory,
} from '../interfaces/firebase';

@Injectable()
export class DatabaseService {
  constructor(private database: AngularFireDatabase) {
  }

  // Create
  async createDeck(args: IUserArgs, name: string, description: string,) : FirebasePromise<void> {
    const deck: { key: string } = await this.getDecks(args).push(args);

    const deckArgs: IDeckArgs = {
      ...args,
      deckId: deck.key,
    };

    await FirebasePromise.all([
      this.updateDeck(deckArgs),
      this.updateDeckInfo(deckArgs, name, description),
    ]);
  }

  async createCard(args: IDeckArgs, front: string, back: string): FirebasePromise<void> {
    const card: { key: string } = await this.getCards(args).push(args);

    const cardArgs: ICardArgs = {
      ...args,
      cardId: card.key,
    };

    await FirebasePromise.all([
      this.updateCard(cardArgs),
      this.updateCardContent(cardArgs, front, back),
      this.updateCardHistory(cardArgs, 2.5, 0, 0, 0, 0),
    ]);
  }

  // Retrieve
  getDecks(args: IUserArgs): FirebaseListObservable<IDeck[]> {
    return this.database.list(this.getDeckBasePath(args));
  }

  getDeck(args: IDeckArgs): FirebaseObjectObservable<IDeck> {
    return this.database.object(this.getDeckPath(args));
  }

  getDeckInfo(args: IDeckArgs): FirebaseObjectObservable<IDeckInfo> {
    return this.database.object(this.getDeckInfoPath(args));
  }

  getCards(args: IDeckArgs): FirebaseListObservable<ICard[]> {
    return this.database.list(this.getCardBasePath(args));
  }

  getCard(args: ICardArgs): FirebaseObjectObservable<ICard> {
    return this.database.object(this.getCardPath(args));
  }

  getCardContent(args: ICardArgs) : FirebaseObjectObservable<ICardContent> {
    return this.database.object(this.getCardContentPath(args));
  }

  getCardHistory(args: ICardArgs) : FirebaseObjectObservable<ICardHistory> {
    return this.database.object(this.getCardHistoryPath(args));
  }

  // Update
  updateDeck(args: IDeckArgs) : FirebasePromise<void> {
    return this.getDeck(args).update({
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

  updateCard(args: ICardArgs) : FirebasePromise<void> {
    return this.getCard(args).update({
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

  updateCardHistory(
    args: ICardArgs,
    difficulty: number,
    grade: number,
    repetitions: number,
    previousReview : number,
    nextReview: number,
  ) : FirebasePromise<void> {
    return this.getCardHistory(args).update({
      ...args,
      difficulty,
      grade,
      repetitions,
      previousReview,
      nextReview,
    });
  }

  // Delete
  deleteDeck(args: IDeckArgs): FirebasePromise<any[]> {
    return FirebasePromise.all([
      this.getDecks(args).remove(args.deckId),
      this.database.list(this.getDeckInfoBasePath(args)).remove(args.deckId),
    ]);
  }

  async deleteCard(args: ICardArgs): FirebasePromise<any[]> {
    return FirebasePromise.all([
      this.getCards(args).remove(args.cardId),
      this.database.list(this.getCardContentBasePath(args)).remove(args.cardId),
      this.database.list(this.getCardHistoryBasePath(args)).remove(args.cardId),
    ]);
  }

  // Base path helpers
  private getDeckBasePath(args: IUserArgs): string {
    return `deck/${args.uid}`;
  }

  private getDeckInfoBasePath(args: IUserArgs): string {
    return `deckInfo/${args.uid}`;
  }

  private getCardBasePath(args: IDeckArgs): string {
    return `card/${args.uid}/${args.deckId}`;
  }

  private getCardContentBasePath(args: IDeckArgs): string {
    return `cardContent/${args.uid}/${args.deckId}`;
  }

  private getCardHistoryBasePath(args: IDeckArgs): string {
    return `cardHistory/${args.uid}/${args.deckId}`;
  }

  // Full path helpers
  private getDeckPath(args: IDeckArgs): string {
    return `${this.getDeckBasePath(args)}/${args.deckId}`;
  }

  private getDeckInfoPath(args: IDeckArgs): string {
    return `${this.getDeckInfoBasePath(args)}/${args.deckId}`;
  }

  private getCardPath(args: ICardArgs): string {
    return `${this.getCardBasePath(args)}/${args.cardId}`;
  }

  private getCardContentPath(args: ICardArgs): string {
    return `${this.getCardContentBasePath(args)}/${args.cardId}`;
  }

  private getCardHistoryPath(args: ICardArgs): string {
    return `${this.getCardHistoryBasePath(args)}/${args.cardId}`;
  }
}