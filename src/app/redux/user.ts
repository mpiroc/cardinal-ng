import { FirebaseActions } from './firebase-actions';
import { FirebaseItemReducer } from './firebase-reducers';
import { FirebaseItemEpic } from './firebase-epics';

export const UserActions = new FirebaseActions<firebase.UserInfo, {}>("USER");
export const UserReducer = new FirebaseItemReducer<firebase.UserInfo, {}>(UserActions);
export const UserEpic = new FirebaseItemEpic(UserActions);