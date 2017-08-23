import { Map } from 'immutable';
import { Action } from 'redux';
import { IFirebaseModel } from '../models/firebase-models';
import {
  FirebaseActions,
  IHasArgs,
  IItemReceivedAction,
  IListReceivedAction,
  IErrorAction,
  USER_LOGOUT,
} from './firebase-actions';

export class FirebaseItemReducer<TModel extends IFirebaseModel, TArgs> {
  private initialState : Map<string, any> = Map({
    isListening: false,
    isLoading: false,
    error: false,
    data: null,
  });

  private initialCollectionState = Map<string, any>();

  constructor(private actions: FirebaseActions<TModel, TArgs>, private selectKey?: (args: TArgs) => string) {
  }

  reducer(state: Map<string, any> = this.initialState, action: Action) : Map<string, any> {
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
          .set("data", Map<string, any>((action as IItemReceivedAction<TModel>).data));

      case this.actions.ERROR:
        return state
          .set("isListening", false)
          .set("isLoading", false)
          .set("error", (action as IErrorAction).error);

      default:
        return state;
    }
  }

  collectionReducer(state: Map<string, any> = this.initialCollectionState, action: Action) : Map<string, any> {
    switch (action.type) {
      case this.actions.START_LISTENING:
      case this.actions.STOP_LISTENING:
      case this.actions.RECEIVED:
      case this.actions.ERROR:
        const key: string = this.selectKey(((action as any) as IHasArgs<TArgs>).args);
        return state.set(key, this.reducer(state.get(key), action as Action));

      case USER_LOGOUT:
        return state.clear();

      default:
        return state;
    }
  }
}

export class FirebaseListReducer<TModel extends IFirebaseModel, TArgs> {
  private initialState : Map<string, any> = Map({
    isListening: false,
    isLoading: false,
    error: false,
    data: Map<string, TModel>(),
  });

  constructor(private actions: FirebaseActions<TModel, TArgs>) {
  }

  reducer(state: Map<string, any> = this.initialState, action: Action) : Map<string, any> {
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
          .set("data", (action as IListReceivedAction<TModel>).data);

      case this.actions.ERROR:
        return state
          .set("isListening", false)
          .set("isLoading", false)
          .set("error", (action as IErrorAction).error);

      case USER_LOGOUT:
        return state.clear();

      default:
        return state;
    }
  }
}