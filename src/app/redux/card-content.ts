import { ICardContent } from '../models/firebase-models';
import { FirebaseActions } from './firebase-actions';
import { FirebaseItemReducer } from './firebase-reducers';
import { FirebaseItemEpic } from './firebase-epics';
import { ICardContentArgs } from '../services/database.service';

export const CardContentActions = new FirebaseActions<ICardContent, ICardContentArgs>("CARD_CONTENT");
export const CardContentReducer = new FirebaseItemReducer<ICardContent, ICardContentArgs>(CardContentActions);
export const CardContentEpic = new FirebaseItemEpic(CardContentActions)