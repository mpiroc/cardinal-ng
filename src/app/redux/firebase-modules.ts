import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {
  FirebaseActions,
  USER_LOGOUT,
  userLogout,
} from './firebase-actions';
import {
  FirebaseObjectReducer,
  FirebaseCollectionReducer,
  FirebaseListReducer,
} from './firebase-reducers';
import {
  FirebaseObjectEpic,
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
export const CardContentObjectReducer = new FirebaseObjectReducer<ICardContent, ICardArgs>(CardContentActions);
export const CardContentCollectionReducer = new FirebaseCollectionReducer<ICardContent, ICardArgs>(
    CardContentActions,
    CardContentObjectReducer,
    args => args.cardId)
export const CardContentEpic = new FirebaseObjectEpic(CardContentActions, [ USER_LOGOUT ]);

export const CardHistoryActions = new FirebaseActions<ICardHistory, ICardArgs>("CARD_HISTORY");
export const CardHistoryObjectReducer = new FirebaseObjectReducer<ICardHistory, ICardArgs>(CardHistoryActions);
export const CardHistoryCollectionReducer = new FirebaseCollectionReducer<ICardHistory, ICardArgs>(
  CardHistoryActions,
  CardHistoryObjectReducer,
  args => args.cardId);
export const CardHistoryEpic = new FirebaseObjectEpic(CardHistoryActions, [ USER_LOGOUT ]);

export const DeckCardActions = new FirebaseActions<IDeckCard, IDeckArgs>("DECK_CARD");
export const DeckCardListReducer = new FirebaseListReducer<IDeckCard, IDeckArgs>(DeckCardActions);
export const DeckCardCollectionReducer = new FirebaseCollectionReducer<IDeckCard, IDeckArgs>(
  DeckCardActions,
  DeckCardListReducer,
  args => args.deckId);
export const DeckCardEpic = new FirebaseListEpic(DeckCardActions, [ USER_LOGOUT ]);

export const DeckInfoActions = new FirebaseActions<IDeckInfo, IDeckArgs>("DECK_INFO");
export const DeckInfoObjectReducer = new FirebaseObjectReducer<IDeckInfo, IDeckArgs>(DeckInfoActions);
export const DeckInfoCollectionReducer = new FirebaseCollectionReducer<IDeckInfo, IDeckArgs>(
  DeckInfoActions,
  DeckInfoObjectReducer,
  args => args.deckId);
export const DeckInfoEpic = new FirebaseObjectEpic(DeckInfoActions, [ USER_LOGOUT ]);

export const UserDeckActions = new FirebaseActions<IUserDeck, IUserArgs>("USER_DECK");
export const UserDeckListReducer = new FirebaseListReducer<IUserDeck, IUserArgs>(UserDeckActions);
export const UserDeckEpic = new FirebaseListEpic(UserDeckActions, [ USER_LOGOUT ]);

export const UserActions = new FirebaseActions<IUser, {}>("USER");
export const UserObjectReducer = new FirebaseObjectReducer<IUser, {}>(UserActions);
export const UserEpic = new FirebaseObjectEpic(UserActions, [],
  (store, data, args) => {
    if (!data) {
      return Observable.of(
        userLogout(),
        UserActions.objectReceived({}, null),
      );
    }

    return Observable.of(
      userLogout(),
      UserActions.objectReceived({}, data),
      UserDeckActions.startListening({ uid: data.uid }),
    );
  }
);