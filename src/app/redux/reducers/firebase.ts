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

class _CardContentObjectReducer extends FirebaseObjectReducer<ICardContent, ICard> {
  constructor() {
    super(CardContentActions);
  }
}
export const CardContentObjectReducer = new _CardContentObjectReducer();

class _CardContentMapReducer extends FirebaseMapReducer<ICardContent, ICard> {
  constructor() {
    super(CardContentActions, CardContentObjectReducer);
  }

  selectKey(args: ICard) {
    return args.cardId;
  }
}
export const CardContentMapReducer = new _CardContentMapReducer();

class _CardHistoryObjectReducer extends FirebaseObjectReducer<ICardHistory, ICard> {
  constructor() {
    super(CardHistoryActions);
  }
}
export const CardHistoryObjectReducer = new _CardHistoryObjectReducer();

class _CardHistoryMapReducer extends FirebaseMapReducer<ICardHistory, ICard> {
  constructor() {
    super(CardHistoryActions, CardHistoryObjectReducer);
  }

  selectKey(args: ICard) {
    return args.cardId;
  }
}
export const CardHistoryMapReducer = new _CardHistoryMapReducer();

class _CardListReducer extends FirebaseListReducer<ICard, IDeck> {
  constructor() {
    super(CardActions);
  }
}
export const CardListReducer = new _CardListReducer();

class _CardMapReducer extends FirebaseMapReducer<ICard, IDeck> {
  constructor() {
    super(CardActions, CardListReducer);
  }

  selectKey(args: IDeck) {
    return args.deckId;
  }
}
export const CardMapReducer = new _CardMapReducer();

class _DeckInfoObjectReducer extends FirebaseObjectReducer<IDeckInfo, IDeck> {
  constructor() {
    super(DeckInfoActions);
  }
}
export const DeckInfoObjectReducer = new _DeckInfoObjectReducer();

class _DeckInfoMapReducer extends FirebaseMapReducer<IDeckInfo, IDeck> {
  constructor() {
    super(DeckInfoActions, DeckInfoObjectReducer);
  }

  selectKey(args: IDeck) {
    return args.deckId;
  }
}
export const DeckInfoMapReducer = new _DeckInfoMapReducer();

class _DeckListReducer extends FirebaseListReducer<IDeck, IUser> {
  constructor() {
    super(DeckActions);
  }
}
export const DeckListReducer = new _DeckListReducer();

class _UserObjectReducer extends FirebaseObjectReducer<IUser, {}> {
  constructor() {
    super(UserActions);
  }
}
export const UserObjectReducer = new _UserObjectReducer();
