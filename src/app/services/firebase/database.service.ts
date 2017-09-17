import { Injectable } from '@angular/core'
import {
  DatabaseShimService,
  IFirebaseListObservable,
  IFirebaseObjectObservable,
} from './database-shim.service'
import { Observable } from 'rxjs/Observable'
import {
  database,
} from 'firebase'

import { AuthService } from './auth.service'
import {
  IUser,
  IDeck,
  IDeckInfo,
  ICard,
  ICardContent,
  ICardHistory,
} from '../../interfaces/firebase'

export abstract class DatabaseService {
  // Create
  abstract createDeck(args: IUser, name: string, description: string): Promise<void>
  abstract createCard(args: IDeck, front: string, back: string): Promise<void>

  // Retrieve
  abstract getDecks(args: IUser): Observable<IDeck[]>
  abstract getDeck(args: IDeck): Observable<IDeck>
  abstract getDeckInfo(args: IDeck): Observable<IDeckInfo>
  abstract getCards(args: IDeck): Observable<ICard[]>
  abstract getCard(args: ICard): Observable<ICard>
  abstract getCardContent(args: ICard): Observable<ICardContent>
  abstract getCardHistory(args: ICard): Observable<ICardHistory>

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
  ): Promise<void>

  // Delete
  abstract deleteDeck(args: IDeck): Promise<any[]>
  abstract deleteCard(args: ICard): Promise<any[]>
}

@Injectable()
export class DatabaseServiceImplementation extends DatabaseService {
  constructor(private databaseShimService: DatabaseShimService) {
    super()
  }

  // Create
  async createDeck(args: IUser, name: string, description: string): Promise<void> {
    const deck: { key: string } = await this._getDecks(args).push(args)

    const deckArgs: IDeck = {
      ...args,
      deckId: deck.key,
    }

    await Promise.all([
      this.updateDeck(deckArgs),
      this.updateDeckInfo(deckArgs, name, description),
    ])
  }

  async createCard(args: IDeck, front: string, back: string): Promise<void> {
    const card: { key: string } = await this._getCards(args).push(args)

    const cardArgs: ICard = {
      ...args,
      cardId: card.key,
    }

    await Promise.all([
      this.updateCard(cardArgs),
      this.updateCardContent(cardArgs, front, back),
      this.updateCardHistory(cardArgs, 2.5, 0, 0, 0, 0),
    ])
  }

  // Retrieve
  getDecks(args: IUser): Observable<IDeck[]> {
    return this._getDecks(args)
  }

  getDeck(args: IDeck): Observable<IDeck> {
    return this._getDeck(args)
  }

  getDeckInfo(args: IDeck): Observable<IDeckInfo> {
    return this._getDeckInfo(args)
  }

  getCards(args: IDeck): Observable<ICard[]> {
    return this._getCards(args)
  }

  getCard(args: ICard): Observable<ICard> {
    return this._getCard(args)
  }

  getCardContent(args: ICard): Observable<ICardContent> {
    return this._getCardContent(args)
  }

  getCardHistory(args: ICard): Observable<ICardHistory> {
    return this._getCardHistory(args)
  }

  private _getDecks(args: IUser): IFirebaseListObservable & Observable<IDeck[]> {
    return this.databaseShimService.list(this.getDeckBasePath(args))
  }

  private _getDeck(args: IDeck): IFirebaseObjectObservable & Observable<IDeck> {
    return this.databaseShimService.object(this.getDeckPath(args))
  }

  private _getDeckInfo(args: IDeck): IFirebaseObjectObservable & Observable<IDeckInfo> {
    return this.databaseShimService.object(this.getDeckInfoPath(args))
  }

  private _getCards(args: IDeck): IFirebaseListObservable & Observable<ICard[]> {
    return this.databaseShimService.list(this.getCardBasePath(args))
  }

  private _getCard(args: ICard): IFirebaseObjectObservable & Observable<ICard> {
    return this.databaseShimService.object(this.getCardPath(args))
  }

  private _getCardContent(args: ICard): IFirebaseObjectObservable & Observable<ICardContent> {
    return this.databaseShimService.object(this.getCardContentPath(args))
  }

  private _getCardHistory(args: ICard): IFirebaseObjectObservable & Observable<ICardHistory> {
    return this.databaseShimService.object(this.getCardHistoryPath(args))
  }

  // Update
  async updateDeck(args: IDeck): Promise<void> {
    await this._getDeck(args).update({
      ...args,
    })
  }

  async updateDeckInfo(args: IDeck, name: string, description: string): Promise<void> {
    await this._getDeckInfo(args).update({
      ...args,
      name,
      description,
    })
  }

  async updateCard(args: ICard): Promise<void> {
    await this._getCard(args).update({
      ...args,
    })
  }

  async updateCardContent(args: ICard, front: string, back: string): Promise<void> {
    await this._getCardContent(args).update({
      ...args,
      front,
      back,
    })
  }

  async updateCardHistory(
    args: ICard,
    difficulty: number,
    grade: number,
    repetitions: number,
    previousReview: number,
    nextReview: number,
  ): Promise<void> {
    await this._getCardHistory(args).update({
      ...args,
      difficulty,
      grade,
      repetitions,
      previousReview,
      nextReview,
    })
  }

  // Delete
  deleteDeck(args: IDeck): Promise<any[]> {
    return Promise.all([
      this._getDecks(args).remove(args.deckId),
      this.databaseShimService.list(this.getDeckInfoBasePath(args)).remove(args.deckId),
    ])
  }

  async deleteCard(args: ICard): Promise<any[]> {
    return Promise.all([
      this._getCards(args).remove(args.cardId),
      this.databaseShimService.list(this.getCardContentBasePath(args)).remove(args.cardId),
      this.databaseShimService.list(this.getCardHistoryBasePath(args)).remove(args.cardId),
    ])
  }

  // Base path helpers
  private getDeckBasePath(args: IUser): string {
    return `deck/${args.uid}`
  }

  private getDeckInfoBasePath(args: IUser): string {
    return `deckInfo/${args.uid}`
  }

  private getCardBasePath(args: IDeck): string {
    return `card/${args.uid}/${args.deckId}`
  }

  private getCardContentBasePath(args: IDeck): string {
    return `cardContent/${args.uid}/${args.deckId}`
  }

  private getCardHistoryBasePath(args: IDeck): string {
    return `cardHistory/${args.uid}/${args.deckId}`
  }

  // Full path helpers
  private getDeckPath(args: IDeck): string {
    return `${this.getDeckBasePath(args)}/${args.deckId}`
  }

  private getDeckInfoPath(args: IDeck): string {
    return `${this.getDeckInfoBasePath(args)}/${args.deckId}`
  }

  private getCardPath(args: ICard): string {
    return `${this.getCardBasePath(args)}/${args.cardId}`
  }

  private getCardContentPath(args: ICard): string {
    return `${this.getCardContentBasePath(args)}/${args.cardId}`
  }

  private getCardHistoryPath(args: ICard): string {
    return `${this.getCardHistoryBasePath(args)}/${args.cardId}`
  }
}
