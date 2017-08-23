import { IDeckCard } from '../models/firebase-models';
import { FirebaseActions } from './firebase-actions';
import { FirebaseListReducer } from './firebase-reducers';
import { FirebaseListEpic } from './firebase-epics';
import { IDeckArgs } from '../services/database.service';

export const DeckCardActions = new FirebaseActions<IDeckCard, IDeckArgs>("DECK_CARD");
export const DeckCardReducer = new FirebaseListReducer<IDeckCard, IDeckArgs>(DeckCardActions);
export const DeckCardEpic = new FirebaseListEpic(DeckCardActions)