import { ICardHistory } from '../models/firebase-models';
import { FirebaseActions } from './firebase-actions';
import { FirebaseItemReducer } from './firebase-reducers';
import { FirebaseItemEpic } from './firebase-epics';
import { ICardArgs } from '../services/database.service';

export const CardHistoryActions = new FirebaseActions<ICardHistory, ICardArgs>("CARD_HISTORY");
export const CardHistoryReducer = new FirebaseItemReducer<ICardHistory, ICardArgs>(CardHistoryActions);
export const CardHistoryEpic = new FirebaseItemEpic(CardHistoryActions)