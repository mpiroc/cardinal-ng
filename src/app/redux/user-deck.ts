import { IUserDeck } from '../models/firebase-models';
import { FirebaseActions } from './firebase-actions';
import { FirebaseListReducer } from './firebase-reducers';
import { FirebaseListEpic } from './firebase-epics';
import { IUserArgs } from '../services/database.service';

export const UserDeckActions = new FirebaseActions<IUserDeck, IUserArgs>("USER_DECK");
export const UserDeckReducer = new FirebaseListReducer<IUserDeck, IUserArgs>(UserDeckActions);
export const UserDeckEpic = new FirebaseListEpic(UserDeckActions)