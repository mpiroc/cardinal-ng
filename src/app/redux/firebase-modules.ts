import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {
  FirebaseActions,
  userLogout,
} from './firebase-actions';
import {
  FirebaseItemReducer,
  FirebaseCollectionReducer,
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
  IUser,
  ICardContent,
  ICardHistory,
  IDeckCard,
  IDeckInfo,
  IUserDeck,
} from '../models/firebase-models';

export const CardContentActions = new FirebaseActions<ICardContent, ICardArgs>("CARD_CONTENT");
export const CardContentItemReducer = new FirebaseItemReducer<ICardContent, ICardArgs>(CardContentActions);
export const CardContentCollectionReducer = new FirebaseCollectionReducer<ICardContent, ICardArgs>(
    CardContentActions,
    CardContentItemReducer,
    args => args.cardId)
export const CardContentEpic = new FirebaseItemEpic(CardContentActions);

export const CardHistoryActions = new FirebaseActions<ICardHistory, ICardArgs>("CARD_HISTORY");
export const CardHistoryItemReducer = new FirebaseItemReducer<ICardHistory, ICardArgs>(CardHistoryActions);
export const CardHistoryCollectionReducer = new FirebaseCollectionReducer<ICardHistory, ICardArgs>(
  CardHistoryActions,
  CardHistoryItemReducer,
  args => args.cardId);
export const CardHistoryEpic = new FirebaseItemEpic(CardHistoryActions);

export const DeckCardActions = new FirebaseActions<IDeckCard, IDeckArgs>("DECK_CARD");
export const DeckCardListReducer = new FirebaseListReducer<IDeckCard, IDeckArgs>(DeckCardActions);
export const DeckCardCollectionReducer = new FirebaseCollectionReducer<IDeckCard, IDeckArgs>(
  DeckCardActions,
  DeckCardListReducer,
  args => args.deckId);
export const DeckCardEpic = new FirebaseListEpic(DeckCardActions);

export const DeckInfoActions = new FirebaseActions<IDeckInfo, IDeckArgs>("DECK_INFO");
export const DeckInfoItemReducer = new FirebaseItemReducer<IDeckInfo, IDeckArgs>(DeckInfoActions);
export const DeckInfoCollectionReducer = new FirebaseCollectionReducer<IDeckInfo, IDeckArgs>(
  DeckInfoActions,
  DeckInfoItemReducer,
  args => args.deckId);
export const DeckInfoEpic = new FirebaseItemEpic(DeckInfoActions);

export const UserDeckActions = new FirebaseActions<IUserDeck, IUserArgs>("USER_DECK");
export const UserDeckListReducer = new FirebaseListReducer<IUserDeck, IUserArgs>(UserDeckActions);
export const UserDeckEpic = new FirebaseListEpic(UserDeckActions);

export const UserActions = new FirebaseActions<IUser, {}>("USER");
export const UserItemReducer = new FirebaseItemReducer<IUser, {}>(UserActions);
export const UserEpic = new FirebaseItemEpic(
  UserActions,
  [],
  (store, data, args) => {
    if (!data) {
      return Observable.of(
        userLogout(),
        UserActions.itemReceived({}, null),
      );
    }

    return Observable.of(
      userLogout(),
      UserActions.itemReceived({}, data),
      UserDeckActions.startListening({ uid: data.uid }),
    );
  }
);