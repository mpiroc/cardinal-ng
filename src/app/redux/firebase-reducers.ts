import { Map } from 'immutable';
import { Action } from 'redux';
import { IFirebaseModel } from '../models/firebase-models';
import {
  FirebaseActions,
  IReceivedAction,
  IErrorAction,
} from './firebase-actions';

export class FirebaseItemReducer<TModel extends IFirebaseModel, TArgs> {
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
          .set("data", Map<string, any>((action as IReceivedAction<TModel>).data));

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