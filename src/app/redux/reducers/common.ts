import { Map } from 'immutable';
import { IFirebaseModel } from '../../models/firebase-models';
import {
  IReceivedAction,
  IErrorAction,
} from '../actions/common';

export function getInitialItemState(data = null) : Map<string, any> {
  return Map({
    isListening: false,
    isLoading: false,
    error: false,
    data: null,
  })
}

export function getInitialListState<T extends IFirebaseModel>() : Map<string, any> {
  return getInitialItemState(Map<string, T>());
}

export function onStartListening(state: Map<string, any>) : Map<string, any> {
  return state
    .set("isListening", true)
    .set("isLoading", true)
    .set("error", null);
}

export function onStopListening(state: Map<string, any>) : Map<string, any> {
  return state
    .set("isListening", false)
    .set("isLoading", false)
    .set("error", null);
}

function onReceived(state: Map<string, any>, data: Map<string, any>) : Map<string, any> {
  return state
    .set("isLoading", false) 
    .set("error", null)
    .set("data", data);
}

export function onItemReceived<T extends IFirebaseModel>(state: Map<string, any>, action: IReceivedAction<T>) : Map<string, any> {
  return onReceived(state, Map<string, any>(action.data));
}

export function onListReceived<T extends IFirebaseModel>(state: Map<string, any>, action: IReceivedAction<Map<string, T>>) : Map<string, any> {
  return onReceived(state, action.data);
}

export function onError(state: Map<string, any>, action: IErrorAction) : Map<string, any> {
  return state
    .set("isListening", false)
    .set("isLoading", false)
    .set("error", action.error);
}