import { Map } from 'immutable';
import { Action } from 'redux';

import {
  IUserArgs,
  IDeckArgs,
  ICardArgs,
  IUser,
  ICardContent,
  ICardHistory,
  IDeckCard,
  IDeckInfo,
  IUserDeck,
} from '../../interfaces/firebase';

export interface IObjectReceivedAction<TModel> extends Action {
  data: TModel;
}

export interface IListReceivedAction<TModel> extends Action {
  data: Map<string, TModel>;
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

  get START_LISTENING() {
    return this.prefix + "_START_LISTENING";
  }

  get BEFORE_STOP_LISTENING() {
    return this.prefix + "_BEFORE_STOP_LISTENING";
  }

  get STOP_LISTENING() {
    return this.prefix + "_STOP_LISTENING";
  }

  get RECEIVED() {
    return this.prefix + "_RECEIVED";
  }

  get ERROR() {
    return this.prefix + "_ERROR";
  }

  startListening(args: TArgs) : IHasArgs<TArgs> & Action {
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

  stopListening(args: TArgs) : IHasArgs<TArgs> & Action {
    return {
      type: this.STOP_LISTENING,
      args,
    };
  }

  objectReceived(args: TArgs, data: TModel) : IHasArgs<TArgs> & Action & IObjectReceivedAction<TModel> {
    return {
      type: this.RECEIVED,
      args,
      data,
    };
  }

  listReceived(args: TArgs, data: Map<string, TModel>) : IHasArgs<TArgs> & Action & IListReceivedAction<TModel> {
    return {
      type: this.RECEIVED,
      args,
      data,
    };
  }

  error(args: TArgs, error: string) : IHasArgs<TArgs> & Action & IErrorAction {
    return {
      type: this.ERROR,
      args,
      error,
    };
  }
}

export const CardContentActions = new FirebaseActions<ICardContent, ICardArgs>("CARD_CONTENT");
export const CardHistoryActions = new FirebaseActions<ICardHistory, ICardArgs>("CARD_HISTORY");
export const DeckCardActions = new FirebaseActions<IDeckCard, IDeckArgs>("DECK_CARD");
export const DeckInfoActions = new FirebaseActions<IDeckInfo, IDeckArgs>("DECK_INFO");
export const UserDeckActions = new FirebaseActions<IUserDeck, IUserArgs>("USER_DECK");
export const UserActions = new FirebaseActions<IUser, {}>("USER");
