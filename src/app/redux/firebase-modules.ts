import { Map } from 'immutable';
import { Action, MiddlewareAPI } from 'redux';
import { IState } from './state';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import {
  IFirebaseModel,
} from '../models/firebase-models';
import { FirebaseActions } from './firebase-actions';
import {
  FirebaseObjectReducer,
  FirebaseMapReducer,
  FirebaseListReducer,
} from './firebase-reducers';
import {
  FirebaseObjectEpic,
  FirebaseListEpic,
  createListReceivedHandler,
  createStopListeningHandler,
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
export const CardContentEpic = new FirebaseObjectEpic(CardContentActions);

export const CardHistoryActions = new FirebaseActions<ICardHistory, ICardArgs>("CARD_HISTORY");
export const CardHistoryObjectReducer = new FirebaseObjectReducer<ICardHistory, ICardArgs>(CardHistoryActions);
export const CardHistoryMapReducer = new FirebaseMapReducer<ICardHistory, ICardArgs>(
  CardHistoryActions,
  CardHistoryObjectReducer,
  args => args.cardId);
export const CardHistoryEpic = new FirebaseObjectEpic(CardHistoryActions);

export const DeckCardActions = new FirebaseActions<IDeckCard, IDeckArgs>("DECK_CARD");
export const DeckCardListReducer = new FirebaseListReducer<IDeckCard, IDeckArgs>(DeckCardActions);
export const DeckCardMapReducer = new FirebaseMapReducer<IDeckCard, IDeckArgs>(
  DeckCardActions,
  DeckCardListReducer,
  args => args.deckId);
function deckCardStopListening(deckCard: IDeckCard) {
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
export const DeckCardEpic = new FirebaseListEpic(DeckCardActions,
  createListReceivedHandler(DeckCardActions, state => state.deckCard, deckCardStopListening),
  createStopListeningHandler(DeckCardActions, state => state.deckCard, deckCardStopListening),
);

export const DeckInfoActions = new FirebaseActions<IDeckInfo, IDeckArgs>("DECK_INFO");
export const DeckInfoObjectReducer = new FirebaseObjectReducer<IDeckInfo, IDeckArgs>(DeckInfoActions);
export const DeckInfoMapReducer = new FirebaseMapReducer<IDeckInfo, IDeckArgs>(
  DeckInfoActions,
  DeckInfoObjectReducer,
  args => args.deckId);
export const DeckInfoEpic = new FirebaseObjectEpic(DeckInfoActions);

export const UserDeckActions = new FirebaseActions<IUserDeck, IUserArgs>("USER_DECK");
export const UserDeckListReducer = new FirebaseListReducer<IUserDeck, IUserArgs>(UserDeckActions);
function userDeckStopListening(userDeck: IUserDeck) {
  const args = {
    uid: userDeck.uid,
    deckId: userDeck.$key,
  };
  return [
    DeckCardActions.stopListening(args),
  ];
}
export const UserDeckEpic = new FirebaseListEpic(UserDeckActions,
  createListReceivedHandler(UserDeckActions, state => state.userDeck, userDeckStopListening),
  createStopListeningHandler(UserDeckActions, state => state.userDeck, userDeckStopListening),
);

export const UserActions = new FirebaseActions<IUser, {}>("USER");
export const UserObjectReducer = new FirebaseObjectReducer<IUser, {}>(UserActions);
export const UserEpic = new FirebaseObjectEpic(UserActions,
  (store, data, args) => {
    let actions: Action[] = [];

    const userStore = store.getState().user;
    const previousUser = userStore.get('data');
    if (previousUser && previousUser.get('uid')) {
      actions = actions.concat(UserDeckActions.stopListening({
        uid: previousUser.get('uid'),
      }));
    }

    actions = actions.concat(UserActions.objectReceived({}, data));

    if (data) {
      actions = actions.concat(UserDeckActions.startListening({ uid: data.uid }));
    }

    return Observable.from(actions);
  }
);