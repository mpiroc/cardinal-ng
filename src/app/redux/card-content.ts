import { ICardContent } from '../models/firebase-models';
import { FirebaseActions } from './firebase-actions';
import { FirebaseItemReducer } from './firebase-reducers';
import { FirebaseItemEpic } from './firebase-epics';
import { ICardArgs } from '../services/database.service';

export const CardContentActions = new FirebaseActions<ICardContent, ICardArgs>("CARD_CONTENT");
export const CardContentReducer = new FirebaseItemReducer<ICardContent, ICardArgs>(CardContentActions);
export const CardContentEpic = new FirebaseItemEpic(CardContentActions);