import { Map } from 'immutable';
import {
  IReceivedAction,
  IErrorAction,
} from '../actions/common';

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

export function onReceived<T>(state: Map<string, any>, action: IReceivedAction<T>) : Map<string, any> {
  return state
    .set("isLoading", false) 
    .set("data", Map<string, any>(action.data));
}

export function onError(state: Map<string, any>, action: IErrorAction) : Map<string, any> {
  return state
    .set("isListening", false)
    .set("isLoading", false)
    .set("error", action.error);
}