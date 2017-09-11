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

export function createReviewEpic(
  logService: LogService,
  ngRedux: NgRedux<IState>,
  gradingService: GradingService,
  cardActions: CardActions,
  cardHistoryActions: CardHistoryActions,
) {
  return (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => action$
    .ofType(REVIEW_SET_DECK)
    .map(action => action as IReviewSetDeckAction)
    .switchMap(action => handleSetDeckReceived(ngRedux, gradingService, cardActions, cardHistoryActions, action.deck))
    .catch(error => {
      logService.error(error.message);

      // TODO: log this error in redux store.
      return Observable.of();
    });
}

function handleSetDeckReceived(
  ngRedux: NgRedux<IState>,
  gradingService: GradingService,
  cardActions: CardActions,
  cardHistoryActions: CardHistoryActions,
  deck: IDeck,
): Observable<Action> {
  return ngRedux
    .select(['card', deck.deckId, 'data'])
    .switchMap((cards: Map<string, ICard>) => handleCardsReceived(ngRedux, gradingService, cardHistoryActions, cards))
    .startWith(cardActions.beforeStartListening(deck));
}

function handleCardsReceived(
  ngRedux: NgRedux<IState>,
  gradingService: GradingService,
  cardHistoryActions: CardHistoryActions,
  cards: Map<string, ICard>,
): Observable<Action> {
  const beforeStartListeningActions: Action[] = cards.valueSeq()
    .map(card => cardHistoryActions.beforeStartListening(card))
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
  return Observable.combineLatest(cardHistories)
    .map(histories => histories.filter(history => gradingService.isDue(history, now)))
    .map(histories => {
      if (histories.length === 0) {
        return reviewSetHistory(null) as Action;
      }
      if (histories.length === 1) {
        return reviewSetHistory(histories[0]) as Action;
      }

      const currentHistory = ngRedux.getState().review.get('history')
      const currentCardId = currentHistory ? currentHistory.cardId : null;
      histories = histories.filter(history => history.cardId !== currentCardId);

      const index = Math.floor(Math.random() * histories.length);
      return reviewSetHistory(histories[index]) as Action;
    })
    .startWith(...beforeStartListeningActions);
}
