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
  IDeck,
  ICard,
  ICardHistory,
} from '../../interfaces/firebase';
import { GradingService } from '../../services/grading.service';
import { LogService } from '../../services/log.service';

import { IState } from '../state';
import {
  REVIEW_SET_DECK,
  IReviewSetDeckAction,
  reviewSetHistory,
} from '../actions/review';
import {
  CardHistoryActions,
  CardActions,
} from '../actions/firebase';

export function createReviewEpic(logService: LogService, ngRedux: NgRedux<IState>, gradingService: GradingService) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(REVIEW_SET_DECK)
    .map(action => action as IReviewSetDeckAction)
    .switchMap(action => handleSetDeckReceived(ngRedux, gradingService, action.deck))
    .catch(error => { 
      logService.error(error.message);

      // TODO: log this error in redux store.
      return Observable.of();
    });
}

function handleSetDeckReceived(ngRedux: NgRedux<IState>, gradingService: GradingService, deck: IDeck) : Observable<Action> {
  return ngRedux
    .select(["card", deck.deckId, "data"])
    .switchMap((cards: Map<string, ICard>) => handleCardsReceived(ngRedux, gradingService, cards))
    .startWith(CardActions.startListening(deck));
}

function handleCardsReceived(ngRedux: NgRedux<IState>, gradingService: GradingService, cards: Map<string, ICard>) : Observable<Action> {
  const startListeningActions: Action[] = cards.valueSeq()
    .map(card => CardHistoryActions.startListening(card))
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