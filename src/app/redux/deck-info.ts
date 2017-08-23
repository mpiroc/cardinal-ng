import { IDeckInfo } from '../models/firebase-models';
import { FirebaseActions } from './firebase-actions';
import { FirebaseItemReducer } from './firebase-reducers';
import { FirebaseItemEpic } from './firebase-epics';
import { IDeckArgs } from '../services/database.service';

export const DeckInfoActions = new FirebaseActions<IDeckInfo, IDeckArgs>("CARD_INFO");
export const DeckInfoReducer = new FirebaseItemReducer<IDeckInfo, IDeckArgs>(DeckInfoActions);
export const DeckInfoEpic = new FirebaseItemEpic(DeckInfoActions)