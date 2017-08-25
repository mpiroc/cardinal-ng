import { Map } from 'immutable';
import { Action } from 'redux';
import { IFirebaseModel } from '../models/firebase-models';

export interface IObjectReceivedAction<TModel extends IFirebaseModel> extends Action {
  data: TModel;
}

export interface IListReceivedAction<TModel extends IFirebaseModel> extends Action {
  data: Map<string, TModel>;
}

export interface IErrorAction extends Action {
  error: string;
}

export interface IHasArgs<TArgs> {
  args: TArgs,
}

export class FirebaseActions<TModel extends IFirebaseModel, TArgs> {
  constructor(public prefix: string) {
  }

  get START_LISTENING() {
    return this.prefix + "_START_LISTENING";
  }

  get STOP_LISTENING() {
    return this.prefix + "_STOP_LISTENING";
  }

  get CLEAR() {
    return this.prefix + "_CLEAR";
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

  stopListening(args: TArgs) : IHasArgs<TArgs> & Action {
    return {
      type: this.STOP_LISTENING,
      args,
    };
  }

  clear(args: TArgs) : IHasArgs<TArgs> & Action {
    return {
      type: this.CLEAR,
      args,
    }
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

