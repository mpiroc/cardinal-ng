import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { Action } from 'redux';

import {
  IUser,
  ICardContent,
  ICardHistory,
  ICard,
  IDeckInfo,
  IDeck,
} from '../../interfaces/firebase';

export interface IObjectReceivedAction<TModel> extends Action {
  data: TModel;
}

export interface IListReceivedAction<TModel> extends Action {
  data: TModel[];
}

export interface ISetIsLoadingAction extends Action {
  isLoading: boolean;
}

export interface IErrorAction extends Action {
  error: string;
}

export interface IHasArgs<TArgs> {
  args: TArgs,
}

export class FirebaseActions<TModel, TArgs> {
  constructor(public prefix: string) {
  }

  get BEFORE_START_LISTENING() {
    return this.prefix + '_BEFORE_START_LISTENING';
  }

  get START_LISTENING() {
    return this.prefix + '_START_LISTENING';
  }

  get BEFORE_STOP_LISTENING() {
    return this.prefix + '_BEFORE_STOP_LISTENING';
  }

  get STOP_LISTENING() {
    return this.prefix + '_STOP_LISTENING';
  }

  get RECEIVED() {
    return this.prefix + '_RECEIVED';
  }

  get SET_IS_LOADING() {
    return this.prefix + '_SET_IS_LOADING';
  }

  get ERROR() {
    return this.prefix + '_ERROR';
  }

  beforeStartListening(args: TArgs): IHasArgs<TArgs> & Action {
    return {
      type: this.BEFORE_START_LISTENING,
      args,
    }
  }

  startListening(args: TArgs): IHasArgs<TArgs> & Action {
    return {
      type: this.START_LISTENING,
      args,
    };
  }

  beforeStopListening(args: TArgs): IHasArgs<TArgs> & Action {
    return {
      type: this.BEFORE_STOP_LISTENING,
      args,
    }
  }

  stopListening(args: TArgs): IHasArgs<TArgs> & Action {
    return {
      type: this.STOP_LISTENING,
      args,
    };
  }

  objectReceived(args: TArgs, data: TModel): IHasArgs<TArgs> & Action & IObjectReceivedAction<TModel> {
    return {
      type: this.RECEIVED,
      args,
      data,
    };
  }

  listReceived(args: TArgs, data: TModel[]): IHasArgs<TArgs> & Action & IListReceivedAction<TModel> {
    return {
      type: this.RECEIVED,
      args,
      data,
    };
  }

  setIsLoading(args: TArgs, isLoading: boolean): IHasArgs<TArgs> & Action & ISetIsLoadingAction {
    return {
      type: this.SET_IS_LOADING,
      args,
      isLoading,
    }
  }

  error(args: TArgs, error: string): IHasArgs<TArgs> & Action & IErrorAction {
    return {
      type: this.ERROR,
      args,
      error,
    };
  }
}

@Injectable()
export class CardContentActions extends FirebaseActions<ICardContent, ICard> {
  constructor() {
    super('CARD_CONTENT');
  }
}

@Injectable()
export class CardHistoryActions extends FirebaseActions<ICardHistory, ICard> {
  constructor() {
    super('CARD_HISTORY');
  }
}

@Injectable()
export class CardActions extends FirebaseActions<ICard, IDeck> {
  constructor() {
    super('CARD');
  }
}

@Injectable()
export class DeckInfoActions extends FirebaseActions<IDeckInfo, IDeck> {
  constructor() {
    super('DECK_INFO');
  }
}

@Injectable()
export class DeckActions extends FirebaseActions<IDeck, IUser> {
  constructor() {
    super('DECK');
  }
}

@Injectable()
export class UserActions extends FirebaseActions<IUser, {}> {
  constructor() {
    super('USER');
  }
}
