import { Map } from 'immutable';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import { Action, MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
import * as moment from 'moment';

import {
  IUserDeck,
  IDeckCard,
  ICardHistory,
} from '../../interfaces/firebase';
import { GradingService } from '../../services/grading.service';

import { IState } from '../state';
import {
  REVIEW_SET_DECK,
  IReviewSetDeckAction,
  reviewSetHistory,
} from '../actions/review';
import {
  CardHistoryActions,
  DeckCardActions,
} from '../actions/firebase';

export function createReviewEpic(ngRedux: NgRedux<IState>, gradingService: GradingService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(REVIEW_SET_DECK)
    .map(action => action as IReviewSetDeckAction)
    .switchMap(action => handleSetDeckReceived(ngRedux, gradingService, action.deck));
}

function handleSetDeckReceived(ngRedux: NgRedux<IState>, gradingService: GradingService, deck: IUserDeck) : Observable<Action> {
  return ngRedux
    .select(["deckCard", deck.deckId, "data"])
    .switchMap((cards: Map<string, IDeckCard>) => handleDeckCardsReceived(ngRedux, gradingService, cards))
    .startWith(DeckCardActions.startListening({
      uid: deck.uid,
      deckId: deck.deckId,
    }));
}

function handleDeckCardsReceived(ngRedux: NgRedux<IState>, gradingService: GradingService, cards: Map<string, IDeckCard>) : Observable<Action> {
  const startListeningActions: Action[] = cards.valueSeq()
    .map(card => CardHistoryActions.startListening({
      uid: card.uid,
      deckId: card.deckId,
      cardId: card.cardId,
    }))
    .toArray();

  const now = moment.now();
  const cardHistories: Observable<ICardHistory>[] = cards.valueSeq()
    .map(card => ngRedux
      .select(['cardHistory', card.cardId, 'data'])
      .filter(history => history ? true : false)
      .map(history => history as Map<string, any>)
      .map(history => history.toJS() as ICardHistory)
      
    )
    .toArray();

  // Pick a current card:
  // 1. Once when all histories have first loaded.
  // 2. Again each time a history changes.
  if (cardHistories.length < 1) {
    return Observable.of(reviewSetHistory(null) as Action)
      .startWith(...startListeningActions);
  }

  return Observable.combineLatest(cardHistories)
    .map(histories => histories.filter(history => gradingService.isDue(history, now)))
    .map(histories => {
      const index = Math.floor(Math.random() * histories.length);
      return reviewSetHistory(histories[index]) as Action;
    })
    .startWith(...startListeningActions);
}