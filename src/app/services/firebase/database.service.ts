import { Injectable, Input } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';
import {
  database,
} from 'firebase';

import { AuthService } from './auth.service';
import {
  IUser,
  IDeck,
  IDeckInfo,
  ICard,
  ICardContent,
  ICardHistory,
} from '../../interfaces/firebase';

export abstract class DatabaseService {
  // Create
  abstract createDeck(args: IUser, name: string, description: string): Promise<void>;
  abstract createCard(args: IDeck, front: string, back: string): Promise<void>;

  // Retrieve
  abstract getDecks(args: IUser): FirebaseListObservable<IDeck[]>;
  abstract getDeck(args: IDeck): FirebaseObjectObservable<IDeck>;
  abstract getDeckInfo(args: IDeck): FirebaseObjectObservable<IDeckInfo>;
  abstract getCards(args: IDeck): FirebaseListObservable<ICard[]>;
  abstract getCard(args: ICard): FirebaseObjectObservable<ICard>;
  abstract getCardContent(args: ICard): FirebaseObjectObservable<ICardContent>;
  abstract getCardHistory(args: ICard): FirebaseObjectObservable<ICardHistory>;

  // Update
  abstract updateDeck(args: IDeck): Promise<void>
  abstract updateDeckInfo(args: IDeck, name: string, description: string): Promise<void>
  abstract updateCard(args: ICard): Promise<void>
  abstract updateCardContent(args: ICard, front: string, back: string): Promise<void>
  abstract updateCardHistory(
    args: ICard,
    difficulty: number,
    grade: number,
    repetitions: number,
    previousReview: number,
    nextReview: number,
  ): Promise<void>;

  // Delete
  abstract deleteDeck(args: IDeck): Promise<any[]>
  abstract async deleteCard(args: ICard): Promise<any[]>
}

@Injectable()
export class DatabaseServiceImplementation extends DatabaseService {
  constructor(private database: AngularFireDatabase) {
    super();
  }

  // Create
  async createDeck(args: IUser, name: string, description: string): Promise<void> {
    const deck: { key: string } = await this.getDecks(args).push(args);

    const deckArgs: IDeck = {
      ...args,
      deckId: deck.key,
    };

    await Promise.all([
      this.updateDeck(deckArgs),
      this.updateDeckInfo(deckArgs, name, description),
    ]);
  }

  async createCard(args: IDeck, front: string, back: string): Promise<void> {
    const card: { key: string } = await this.getCards(args).push(args);

    const cardArgs: ICard = {
      ...args,
      cardId: card.key,
    };

    await Promise.all([
      this.updateCard(cardArgs),
      this.updateCardContent(cardArgs, front, back),
      this.updateCardHistory(cardArgs, 2.5, 0, 0, 0, 0),
    ]);
  }

  // Retrieve
  getDecks(args: IUser): FirebaseListObservable<IDeck[]> {
    return this.database.list(this.getDeckBasePath(args));
  }

  getDeck(args: IDeck): FirebaseObjectObservable<IDeck> {
    return this.database.object(this.getDeckPath(args));
  }

  getDeckInfo(args: IDeck): FirebaseObjectObservable<IDeckInfo> {
    return this.database.object(this.getDeckInfoPath(args));
  }

  getCards(args: IDeck): FirebaseListObservable<ICard[]> {
    return this.database.list(this.getCardBasePath(args));
  }

  getCard(args: ICard): FirebaseObjectObservable<ICard> {
    return this.database.object(this.getCardPath(args));
  }

  getCardContent(args: ICard): FirebaseObjectObservable<ICardContent> {
    return this.database.object(this.getCardContentPath(args));
  }

  getCardHistory(args: ICard): FirebaseObjectObservable<ICardHistory> {
    return this.database.object(this.getCardHistoryPath(args));
  }

  // Update
  async updateDeck(args: IDeck): Promise<void> {
    await this.getDeck(args).update({
      ...args,
    });
  }

  async updateDeckInfo(args: IDeck, name: string, description: string): Promise<void> {
    await this.getDeckInfo(args).update({
      ...args,
      name,
      description,
    });
  }

  async updateCard(args: ICard): Promise<void> {
    await this.getCard(args).update({
      ...args,
    });
  }

  async updateCardContent(args: ICard, front: string, back: string): Promise<void> {
    await this.getCardContent(args).update({
      ...args,
      front,
      back,
    });
  }

  async updateCardHistory(
    args: ICard,
    difficulty: number,
    grade: number,
    repetitions: number,
    previousReview: number,
    nextReview: number,
  ): Promise<void> {
    await this.getCardHistory(args).update({
      ...args,
      difficulty,
      grade,
      repetitions,
      previousReview,
      nextReview,
    });
  }

  // Delete
  deleteDeck(args: IDeck): Promise<any[]> {
    return Promise.all([
      this.getDecks(args).remove(args.deckId),
      this.database.list(this.getDeckInfoBasePath(args)).remove(args.deckId),
    ]);
  }

  async deleteCard(args: ICard): Promise<any[]> {
    return Promise.all([
      this.getCards(args).remove(args.cardId),
      this.database.list(this.getCardContentBasePath(args)).remove(args.cardId),
      this.database.list(this.getCardHistoryBasePath(args)).remove(args.cardId),
    ]);
  }

  // Base path helpers
  private getDeckBasePath(args: IUser): string {
    return `deck/${args.uid}`;
  }

  private getDeckInfoBasePath(args: IUser): string {
    return `deckInfo/${args.uid}`;
  }

  private getCardBasePath(args: IDeck): string {
    return `card/${args.uid}/${args.deckId}`;
  }

  private getCardContentBasePath(args: IDeck): string {
    return `cardContent/${args.uid}/${args.deckId}`;
  }

  private getCardHistoryBasePath(args: IDeck): string {
    return `cardHistory/${args.uid}/${args.deckId}`;
  }

  // Full path helpers
  private getDeckPath(args: IDeck): string {
    return `${this.getDeckBasePath(args)}/${args.deckId}`;
  }

  private getDeckInfoPath(args: IDeck): string {
    return `${this.getDeckInfoBasePath(args)}/${args.deckId}`;
  }

  private getCardPath(args: ICard): string {
    return `${this.getCardBasePath(args)}/${args.cardId}`;
  }

  private getCardContentPath(args: ICard): string {
    return `${this.getCardContentBasePath(args)}/${args.cardId}`;
  }

  private getCardHistoryPath(args: ICard): string {
    return `${this.getCardHistoryBasePath(args)}/${args.cardId}`;
  }
}
