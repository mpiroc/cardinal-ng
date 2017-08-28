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
  IUserDeck,
  IDeckInfo,
  IDeckCard,
  ICardContent,
  ICardHistory,
} from '../interfaces/firebase';

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

  async createCard(args: IDeckArgs, front: string, back: string): FirebasePromise<void> {
    const deckCard: { key: string } = await this.getDeckCards(args).push(args);

    const cardArgs: ICardArgs = {
      ...args,
      cardId: deckCard.key,
    };

    await FirebasePromise.all([
      this.updateDeckCard(cardArgs),
      this.updateCardContent(cardArgs, front, back),
      this.updateCardHistory(cardArgs, 2.5, 0, 0, 0, 0),
    ]);
  }

  // Retrieve
  getUserDecks(args: IUserArgs): FirebaseListObservable<IUserDeck[]> {
    return this.database.list(this.getUserDeckBasePath(args));
  }

  getUserDeck(args: IDeckArgs): FirebaseObjectObservable<IUserDeck> {
    return this.database.object(this.getUserDeckPath(args));
  }

  getDeckInfo(args: IDeckArgs): FirebaseObjectObservable<IDeckInfo> {
    return this.database.object(this.getDeckInfoPath(args));
  }

  getDeckCards(args: IDeckArgs): FirebaseListObservable<IDeckCard[]> {
    return this.database.list(this.getDeckCardBasePath(args));
  }

  getDeckCard(args: ICardArgs): FirebaseObjectObservable<IDeckCard> {
    return this.database.object(this.getDeckCardPath(args));
  }

  getCardContent(args: ICardArgs) : FirebaseObjectObservable<ICardContent> {
    return this.database.object(this.getCardContentPath(args));
  }

  getCardHistory(args: ICardArgs) : FirebaseObjectObservable<ICardHistory> {
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