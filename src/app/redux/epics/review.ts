import { Injectable } from '@angular/core';
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

@Injectable()
export class ReviewEpic {
  public readonly epic: (action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>) => Observable<Action>;

  constructor(
    private logService: LogService,
    private ngRedux: NgRedux<IState>,
    private gradingService: GradingService,
    private cardActions: CardActions,
    private cardHistoryActions: CardHistoryActions,
  ) {
    this.epic = this._epic.bind(this);
  }

  private _epic(action$: ActionsObservable<Action>, store: MiddlewareAPI<IState>): Observable<Action> {
    return action$
      .ofType(REVIEW_SET_DECK)
      .map(action => action as IReviewSetDeckAction)
      .switchMap(action => this.handleSetDeckReceived(action.deck))
      .catch(error => {
        this.logService.error(error.message);

        // TODO: log this error in redux store.
        return Observable.of<Action>();
      });
  }

  private handleSetDeckReceived(deck: IDeck): Observable<Action> {
    return this.ngRedux
      .select(['card', deck.deckId, 'data'])
      .switchMap((cards: Map<string, ICard>) => this.handleCardsReceived(cards))
      .startWith(this.cardActions.beforeStartListening(deck));
  }

  private handleCardsReceived(cards: Map<string, ICard>): Observable<Action> {
    const beforeStartListeningActions: Action[] = cards.valueSeq()
      .map(card => this.cardHistoryActions.beforeStartListening(card))
      .toArray();

    const now = moment.now();
    const cardHistories: Observable<ICardHistory>[] = cards.valueSeq()
      .map(card => this.ngRedux
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
      .map(histories => histories.filter(history => this.gradingService.isDue(history, now)))
      .map(histories => {
        if (histories.length === 0) {
          return reviewSetHistory(null) as Action;
        }
        if (histories.length === 1) {
          return reviewSetHistory(histories[0]) as Action;
        }

        const currentHistory = this.ngRedux.getState().review.get('history')
        const currentCardId = currentHistory ? currentHistory.cardId : null;
        histories = histories.filter(history => history.cardId !== currentCardId);

        const index = Math.floor(Math.random() * histories.length);
        return reviewSetHistory(histories[index]) as Action;
      })
      .startWith(...beforeStartListeningActions);
  }
}
