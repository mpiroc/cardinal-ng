import { Map } from 'immutable';
import { Action, MiddlewareAPI } from 'redux';
import { IState } from './state';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import {
  IFirebaseModel,
} from '../models/firebase-models';
import {
  FirebaseActions,
  USER_LOGOUT,
  userLogout,
} from './firebase-actions';
import {
  FirebaseObjectReducer,
  FirebaseMapReducer,
  FirebaseListReducer,
} from './firebase-reducers';
import {
  FirebaseObjectEpic,
  FirebaseListEpic,
  createListReceivedHandler,
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
export const CardContentMapReducer = new FirebaseMapReducer<ICardContent, ICardArgs>(
    CardContentActions,
    CardContentObjectReducer,
    args => args.cardId)
export const CardContentEpic = new FirebaseObjectEpic(CardContentActions, [ USER_LOGOUT ]);

export const CardHistoryActions = new FirebaseActions<ICardHistory, ICardArgs>("CARD_HISTORY");
export const CardHistoryObjectReducer = new FirebaseObjectReducer<ICardHistory, ICardArgs>(CardHistoryActions);
export const CardHistoryMapReducer = new FirebaseMapReducer<ICardHistory, ICardArgs>(
  CardHistoryActions,
  CardHistoryObjectReducer,
  args => args.cardId);
export const CardHistoryEpic = new FirebaseObjectEpic(CardHistoryActions, [ USER_LOGOUT ]);

export const DeckCardActions = new FirebaseActions<IDeckCard, IDeckArgs>("DECK_CARD");
export const DeckCardListReducer = new FirebaseListReducer<IDeckCard, IDeckArgs>(DeckCardActions);
export const DeckCardMapReducer = new FirebaseMapReducer<IDeckCard, IDeckArgs>(
  DeckCardActions,
  DeckCardListReducer,
  args => args.deckId);
export const DeckCardEpic = new FirebaseListEpic(DeckCardActions, [ USER_LOGOUT ],
  createListReceivedHandler(
    DeckCardActions,
    state => state.deckCard,
    deckCard => {
      const args = {
        uid: deckCard.uid,
        deckId: deckCard.deckId,
        cardId: deckCard.$key,
      }
      return [
        CardContentActions.stopListening(args),
        CardHistoryActions.stopListening(args),
      ];
    }
  )
);

export const DeckInfoActions = new FirebaseActions<IDeckInfo, IDeckArgs>("DECK_INFO");
export const DeckInfoObjectReducer = new FirebaseObjectReducer<IDeckInfo, IDeckArgs>(DeckInfoActions);
export const DeckInfoMapReducer = new FirebaseMapReducer<IDeckInfo, IDeckArgs>(
  DeckInfoActions,
  DeckInfoObjectReducer,
  args => args.deckId);
export const DeckInfoEpic = new FirebaseObjectEpic(DeckInfoActions, [ USER_LOGOUT ]);

export const UserDeckActions = new FirebaseActions<IUserDeck, IUserArgs>("USER_DECK");
export const UserDeckListReducer = new FirebaseListReducer<IUserDeck, IUserArgs>(UserDeckActions);
export const UserDeckEpic = new FirebaseListEpic(UserDeckActions, [ USER_LOGOUT ],
  createListReceivedHandler(
    UserDeckActions,
    state => state.userDeck,
    userDeck => {
      const args = {
        uid: userDeck.uid,
        deckId: userDeck.$key,
      };
      return [
        DeckInfoActions.stopListening(args),
      ];
    }
  )
);

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