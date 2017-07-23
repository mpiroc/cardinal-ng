import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { DatabaseService } from '../../services/database.service';
import { IDeckInfo } from '../../models/firebase-models';

// Actions
const DECK_INFO_LISTEN = "DECK_INFO_LISTEN";
const DECK_INFO_RECEIVED = "DECK_INFO_RECIEVED";
const DECK_INFO_ERROR = "DECK_INFO_ERROR";
const DECK_INFO_STOP_LISTENING = "DECK_INFO_STOP_LISTENING";

interface IDeckInfoAction extends Action {
  deckId: string;
}

interface IDeckInfoListenAction extends IDeckInfoAction {
}

interface IDeckInfoReceivedAction extends IDeckInfoAction {
  name: string;
  description: string;
}

interface IDeckInfoErrorAction extends IDeckInfoAction {
  error: string;
}

interface IDeckInfoStopListeningAction extends IDeckInfoAction {
}

function deckInfoListen(deckId: string) : IDeckInfoListenAction {
  return {
    type: DECK_INFO_LISTEN,
    deckId,
  };
}

function deckInfoReceived(deckId: string, name: string, description: string) : IDeckInfoReceivedAction {
  return {
    type: DECK_INFO_RECEIVED,
    deckId,
    name,
    description,
  };
}

function deckInfoError(deckId: string, error: string) : IDeckInfoErrorAction {
  return {
    type: DECK_INFO_ERROR,
    deckId,
    error,
  };
}

function deckInfoStopListening(deckId: string) : IDeckInfoStopListeningAction {
  return {
    type: DECK_INFO_STOP_LISTENING,
    deckId,
  }
}

export function createDeckInfoListenEpic(databaseService: DatabaseService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<Map<string, any>>) => action$
    .ofType(DECK_INFO_LISTEN)
    .mergeMap((action: IDeckInfoListenAction) => databaseService.getDeckInfo(store.getState().getIn(['auth', 'uid']), action.deckId)
      .map((deckInfo: IDeckInfo) => deckInfoReceived(deckInfo.$key, deckInfo.name, deckInfo.description))
      .takeUntil(action$
        .ofType(DECK_INFO_STOP_LISTENING)
        .filter((stopAction: IDeckInfoStopListeningAction) => stopAction.deckId === action.deckId)
      )
      .catch(err => Observable.of(deckInfoError(action.deckId, err.message)))
    );
}

const initialDeckInfoState: Map<string, any> = Map({
  name: null,
  description: null,
  isListening: false,
  isLoading: false,
  error: null,
})

function deckInfo(state: Map<string, any> = initialDeckInfoState, action: Action) {
  switch (action.type) {
    case DECK_INFO_LISTEN:
      return state
        .set("isListening", true)
        .set("isLoading", true)
        .set("error", null);

    case DECK_INFO_RECEIVED:
    {
      const typedAction = action as IDeckInfoReceivedAction;
      return state
        .set("isLoading", false)
        .set("name", typedAction.name)
        .set("description", typedAction.description);
    }

    case DECK_INFO_ERROR:
    {
      const typedAction = action as IDeckInfoErrorAction;
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", typedAction.error);
    }

    case DECK_INFO_STOP_LISTENING:
      return state
        .set("isListening", false)
        .set("isLoading", false)
        .set("error", null);
    
    default:
      return state;
  }
}

const initialDeckInfosState = Map<string, any>({
})

function deckInfos(state: Map<string, any> = initialDeckInfosState, action: Action) {
  switch (action.type) {
    case DECK_INFO_LISTEN:
    case DECK_INFO_RECEIVED:
    case DECK_INFO_ERROR:
    case DECK_INFO_STOP_LISTENING:
      const typedAction: IDeckInfoAction = (action as IDeckInfoAction);
      return state.set(typedAction.deckId, deckInfo(
        state.get(typedAction.deckId),
        action));
    
    default:
      return state;
  }
}