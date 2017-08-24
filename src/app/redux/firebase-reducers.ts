import { Map } from 'immutable';
import { Action } from 'redux';
import { IFirebaseModel } from '../models/firebase-models';
import {
  FirebaseActions,
  IHasArgs,
  IObjectReceivedAction,
  IListReceivedAction,
  IErrorAction,
  USER_LOGOUT,
} from './firebase-actions';

export interface IFirebaseReducer {
  reducer: (state: Map<string, any>, action: Action) => Map<string, any>;
}

export class FirebaseObjectReducer<TModel extends IFirebaseModel, TArgs> implements IFirebaseReducer {
  private initialState : Map<string, any> = Map({
    isListening: false,
    isLoading: false,
    error: false,
    data: null,
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
          .set("data", Map<string, any>((action as IObjectReceivedAction<TModel>).data));

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

export class FirebaseMapReducer<TModel extends IFirebaseModel, TArgs> implements IFirebaseReducer {
  private initialState = Map<string, TModel>();

  constructor(
    private actions: FirebaseActions<TModel, TArgs>,
    private objectReducer: IFirebaseReducer,
    private selectKey: (args: TArgs) => string) {
  }

  reducer(state: Map<string, any> = this.initialState, action: Action) : Map<string, any> {
    switch (action.type) {
      case this.actions.START_LISTENING:
      case this.actions.RECEIVED:
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

      case USER_LOGOUT:
        return state.clear();

      default:
        return state;
    }
  }
}

export class FirebaseListReducer<TModel extends IFirebaseModel, TArgs> implements IFirebaseReducer {
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