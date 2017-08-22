import { Action } from 'redux';

export interface IReceivedAction<T> extends Action {
  data: T;
}

export interface IErrorAction extends Action {
  error: string;
}