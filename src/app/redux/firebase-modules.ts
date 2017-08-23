import { FirebaseActions } from './firebase-actions';
import {
  FirebaseItemReducer,
  FirebaseListReducer,
} from './firebase-reducers';
import {
  FirebaseItemEpic,
  FirebaseListEpic,
} from './firebase-epics';
import {
  IUserArgs,
  IDeckArgs,
  ICardArgs,
} from '../services/database.service';
import {
  ICardContent,
  ICardHistory,
  IDeckCard,
  IDeckInfo,
  IUserDeck,
} from '../models/firebase-models';

export const CardContentActions = new FirebaseActions<ICardContent, ICardArgs>("CARD_CONTENT");
export const CardContentReducer = new FirebaseItemReducer<ICardContent, ICardArgs>(CardContentActions, args => args.cardId);
export const CardContentEpic = new FirebaseItemEpic(CardContentActions);

export const CardHistoryActions = new FirebaseActions<ICardHistory, ICardArgs>("CARD_HISTORY");
export const CardHistoryReducer = new FirebaseItemReducer<ICardHistory, ICardArgs>(CardHistoryActions, args => args.cardId);
export const CardHistoryEpic = new FirebaseItemEpic(CardHistoryActions);

export const DeckCardActions = new FirebaseActions<IDeckCard, IDeckArgs>("DECK_CARD");
export const DeckCardReducer = new FirebaseListReducer<IDeckCard, IDeckArgs>(DeckCardActions);
export const DeckCardEpic = new FirebaseListEpic(DeckCardActions);

export const DeckInfoActions = new FirebaseActions<IDeckInfo, IDeckArgs>("CARD_INFO");
export const DeckInfoReducer = new FirebaseItemReducer<IDeckInfo, IDeckArgs>(DeckInfoActions, args => args.deckId);
export const DeckInfoEpic = new FirebaseItemEpic(DeckInfoActions);

export const UserDeckActions = new FirebaseActions<IUserDeck, IUserArgs>("USER_DECK");
export const UserDeckReducer = new FirebaseListReducer<IUserDeck, IUserArgs>(UserDeckActions);
export const UserDeckEpic = new FirebaseListEpic(UserDeckActions);

// TODO: It was a mistake to merge the user reducer with the other reducers. Should separate it back out.
export const UserActions = new FirebaseActions<firebase.UserInfo, {}>("USER");
export const UserReducer = new FirebaseItemReducer<firebase.UserInfo, {}>(UserActions);
export const UserEpic = new FirebaseItemEpic(UserActions);