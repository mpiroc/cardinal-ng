import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { Action, Reducer } from 'redux';

import {
  IUser,
  ICardContent,
  ICardHistory,
  ICard,
  IDeckInfo,
  IDeck,
} from '../../interfaces/firebase';

import {
  FirebaseActions,
  IHasArgs,
  IObjectReceivedAction,
  IListReceivedAction,
  ISetIsLoadingAction,
  IErrorAction,
  CardContentActions,
  CardHistoryActions,
  CardActions,
  DeckInfoActions,
  DeckActions,
  UserActions,
} from '../actions/firebase';

export interface IFirebaseReducer {
  reducer: Reducer<Map<string, any>>;
}

export abstract class FirebaseObjectReducer<TModel, TArgs> implements IFirebaseReducer {
  private initialState: Map<string, any> = Map({
    isListening: false,
    isLoading: true,
    error: null,
    data: null,
  });

  public reducer: Reducer<Map<string, any>>;

  constructor(private actions: FirebaseActions<TModel, TArgs>) {
    this.reducer = this._reducer.bind(this);
  }

  _reducer(state: Map<string, any> = this.initialState, action: Action): Map<string, any> {
    switch (action.type) {
      case this.actions.START_LISTENING:
        return state
          .set('isListening', true)
          .set('isLoading', true)
          .set('error', null);

      case this.actions.STOP_LISTENING:
        return state
          .set('isListening', false)
          .set('isLoading', false)
          .set('error', null);

      case this.actions.RECEIVED:
        return state
          .set('isLoading', false)
          .set('error', null)
          .set('data', Map<string, any>((action as IObjectReceivedAction<TModel>).data));

      case this.actions.SET_IS_LOADING:
        return state
          .set('isLoading', (action as ISetIsLoadingAction).isLoading);

      case this.actions.ERROR:
        return state
          .set('isListening', false)
          .set('isLoading', false)
          .set('error', (action as IErrorAction).error);

      default:
        return state;
    }
  }
}

export abstract class FirebaseMapReducer<TModel, TArgs> implements IFirebaseReducer {
  private initialState = Map<string, Map<string, any>>();

  public reducer: Reducer<Map<string, any>>;

  constructor(
    private actions: FirebaseActions<TModel, TArgs>,
    private objectReducer: IFirebaseReducer) {
    this.reducer = this._reducer.bind(this);
  }

  abstract selectKey(args: TArgs): string;

  _reducer(state: Map<string, any> = this.initialState, action: Action): Map<string, any> {
    switch (action.type) {
      case this.actions.BEFORE_START_LISTENING:
      case this.actions.START_LISTENING:
      case this.actions.BEFORE_STOP_LISTENING:
      case this.actions.RECEIVED:
      case this.actions.SET_IS_LOADING:
      case this.actions.ERROR:
      {
        const key: string = this.selectKey(((action as any) as IHasArgs<TArgs>).args);
        return state.set(key, this.objectReducer.reducer(state.get(key), action as Action));
      }

      case this.actions.STOP_LISTENING:
      {
        const key: string = this.selectKey(((action as any) as IHasArgs<TArgs>).args);
        return state.remove(key);
      }

      default:
        return state;
    }
  }
}

export abstract class FirebaseListReducer<TModel, TArgs> implements IFirebaseReducer {
  private initialState: Map<string, any> = Map({
    isListening: false,
    isLoading: true,
    error: null,
    data: Map<string, TModel>(),
  });

  public reducer: Reducer<Map<string, any>>;

  constructor(private actions: FirebaseActions<TModel, TArgs>) {
    this.reducer = this._reducer.bind(this);
  }

  private _reducer(state: Map<string, any> = this.initialState, action: Action): Map<string, any> {
    switch (action.type) {
      case this.actions.START_LISTENING:
        return state
          .set('isListening', true)
          .set('isLoading', true)
          .set('error', null);

      case this.actions.STOP_LISTENING:
        return state
          .set('isListening', false)
          .set('isLoading', false)
          .set('error', null)
          .set('data', state.get('data').clear());

      case this.actions.RECEIVED:
        return state
          .set('isLoading', false)
          .set('error', null)
          .set('data', (action as IListReceivedAction<TModel>).data);

      case this.actions.SET_IS_LOADING:
        return state
          .set('isLoading', (action as ISetIsLoadingAction).isLoading);

      case this.actions.ERROR:
        return state
          .set('isListening', false)
          .set('isLoading', false)
          .set('error', (action as IErrorAction).error);

      default:
        return state;
    }
  }
}

@Injectable()
export class CardContentObjectReducer extends FirebaseObjectReducer<ICardContent, ICard> {
  constructor(private cardContentActions: CardContentActions) {
    super(cardContentActions);
  }
}

@Injectable()
export class CardContentMapReducer extends FirebaseMapReducer<ICardContent, ICard> {
  constructor(cardContentActions: CardContentActions, cardContentObjectReducer: CardContentObjectReducer) {
    super(cardContentActions, cardContentObjectReducer);
  }

  selectKey(args: ICard) {
    return args.cardId;
  }
}

@Injectable()
export class CardHistoryObjectReducer extends FirebaseObjectReducer<ICardHistory, ICard> {
  constructor(cardHistoryActions: CardHistoryActions) {
    super(cardHistoryActions);
  }
}

@Injectable()
export class CardHistoryMapReducer extends FirebaseMapReducer<ICardHistory, ICard> {
  constructor(cardHistoryActions: CardHistoryActions, cardHistoryObjectReducer: CardHistoryObjectReducer) {
    super(cardHistoryActions, cardHistoryObjectReducer);
  }

  selectKey(args: ICard) {
    return args.cardId;
  }
}

@Injectable()
export class CardListReducer extends FirebaseListReducer<ICard, IDeck> {
  constructor(cardActions: CardActions) {
    super(cardActions);
  }
}

@Injectable()
export class CardMapReducer extends FirebaseMapReducer<ICard, IDeck> {
  constructor(cardActions: CardActions, cardListReducer: CardListReducer) {
    super(cardActions, cardListReducer);
  }

  selectKey(args: IDeck) {
    return args.deckId;
  }
}

@Injectable()
export class DeckInfoObjectReducer extends FirebaseObjectReducer<IDeckInfo, IDeck> {
  constructor(deckInfoActions: DeckInfoActions) {
    super(deckInfoActions);
  }
}

@Injectable()
export class DeckInfoMapReducer extends FirebaseMapReducer<IDeckInfo, IDeck> {
  constructor(deckInfoActions: DeckInfoActions, deckInfoObjectReducer: DeckInfoObjectReducer) {
    super(deckInfoActions, deckInfoObjectReducer);
  }

  selectKey(args: IDeck) {
    return args.deckId;
  }
}

@Injectable()
export class DeckListReducer extends FirebaseListReducer<IDeck, IUser> {
  constructor(deckActions: DeckActions) {
    super(deckActions);
  }
}

@Injectable()
export class UserObjectReducer extends FirebaseObjectReducer<IUser, {}> {
  constructor(userActions: UserActions) {
    super(userActions);
  }
}
