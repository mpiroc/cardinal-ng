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

export class FirebaseObjectReducer<TModel, TArgs> implements IFirebaseReducer {
  private initialState : Map<string, any> = Map({
    isListening: false,
    isLoading: true,
    error: null,
    data: null,
  });

  public reducer: Reducer<Map<string, any>>;

  constructor(private actions: FirebaseActions<TModel, TArgs>) {
    this.reducer = this._reducer.bind(this);
  }

  _reducer(state: Map<string, any> = this.initialState, action: Action) : Map<string, any> {
    switch (action.type) {
      case this.actions.START_LISTENING:
        return state
          .set("isListening", true)
          .set("isLoading", true)
          .set("error", null);

      case this.actions.STOP_LISTENING:
        return state
          .set("isListening", false)
          .set("isLoading", false)
          .set("error", null);

      case this.actions.RECEIVED:
        return state
          .set("isLoading", false) 
          .set("error", null)
          .set("data", Map<string, any>((action as IObjectReceivedAction<TModel>).data));

      case this.actions.SET_IS_LOADING:
        return state
          .set("isLoading", (action as ISetIsLoadingAction).isLoading);

      case this.actions.ERROR:
        return state
          .set("isListening", false)
          .set("isLoading", false)
          .set("error", (action as IErrorAction).error);

      default:
        return state;
    }
  }
}

export class FirebaseMapReducer<TModel, TArgs> implements IFirebaseReducer {
  private initialState = Map<string, Map<string, any>>();

  public reducer: Reducer<Map<string, any>>;

  constructor(
    private actions: FirebaseActions<TModel, TArgs>,
    private objectReducer: IFirebaseReducer,
    private selectKey: (args: TArgs) => string) {
    this.reducer = this._reducer.bind(this);
  }

  _reducer(state: Map<string, any> = this.initialState, action: Action) : Map<string, any> {
    switch (action.type) {
      case this.actions.START_LISTENING:
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

export class FirebaseListReducer<TModel, TArgs> implements IFirebaseReducer {
  private initialState : Map<string, any> = Map({
    isListening: false,
    isLoading: true,
    error: null,
    data: Map<string, TModel>(),
  });

  public reducer: Reducer<Map<string, any>>;

  constructor(private actions: FirebaseActions<TModel, TArgs>) {
    this.reducer = this._reducer.bind(this);
  }

  private _reducer(state: Map<string, any> = this.initialState, action: Action) : Map<string, any> {
    switch (action.type) {
      case this.actions.START_LISTENING:
        return state
          .set("isListening", true)
          .set("isLoading", true)
          .set("error", null);

      case this.actions.STOP_LISTENING:
        return state
          .set("isListening", false)
          .set("isLoading", false)
          .set("error", null)
          .set("data", state.get("data").clear());

      case this.actions.RECEIVED:
        return state
          .set("isLoading", false) 
          .set("error", null)
          .set("data", (action as IListReceivedAction<TModel>).data);

      case this.actions.SET_IS_LOADING:
        return state
          .set("isLoading", (action as ISetIsLoadingAction).isLoading);

      case this.actions.ERROR:
        return state
          .set("isListening", false)
          .set("isLoading", false)
          .set("error", (action as IErrorAction).error);

      default:
        return state;
    }
  }
}

export const CardContentObjectReducer = new FirebaseObjectReducer<ICardContent, ICard>(CardContentActions);
export const CardContentMapReducer = new FirebaseMapReducer<ICardContent, ICard>(
    CardContentActions,
    CardContentObjectReducer,
    args => args.cardId);

export const CardHistoryObjectReducer = new FirebaseObjectReducer<ICardHistory, ICard>(CardHistoryActions);
export const CardHistoryMapReducer = new FirebaseMapReducer<ICardHistory, ICard>(
  CardHistoryActions,
  CardHistoryObjectReducer,
  args => args.cardId);

export const CardListReducer = new FirebaseListReducer<ICard, IDeck>(CardActions);
export const CardMapReducer = new FirebaseMapReducer<ICard, IDeck>(
  CardActions,
  CardListReducer,
  args => args.deckId);

export const DeckInfoObjectReducer = new FirebaseObjectReducer<IDeckInfo, IDeck>(DeckInfoActions);
export const DeckInfoMapReducer = new FirebaseMapReducer<IDeckInfo, IDeck>(
  DeckInfoActions,
  DeckInfoObjectReducer,
  args => args.deckId);

export const DeckListReducer = new FirebaseListReducer<IDeck, IUser>(DeckActions);

export const UserObjectReducer = new FirebaseObjectReducer<IUser, {}>(UserActions);