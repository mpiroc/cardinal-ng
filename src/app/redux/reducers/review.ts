import { Map } from 'immutable';
import { Action } from 'redux';

import {
  REVIEW_SET_DECK,
  REVIEW_SET_HISTORY,
  REVIEW_SET_GRADE,
  IReviewSetDeckAction,
  IReviewSetHistoryAction,
  IReviewSetGradeAction,
} from '../actions/review';

const initialReviewState = Map<string, any>({
  isLoading: true,
  deck: null,
  history: null,
  grade: 0,
});

export function review(state: Map<string, any> = initialReviewState, action: Action): Map<string, any> {
  switch (action.type) {
    case REVIEW_SET_DECK:
      return state
        .set('isLoading', true)
        .set('history', null)
        .set('deck', (action as IReviewSetDeckAction).deck);

    case REVIEW_SET_HISTORY:
      const history = (action as IReviewSetHistoryAction).history;
      return state
        .set('isLoading', false)
        .set('history', history)
        .set('grade', history ? history.grade : 0);

    case REVIEW_SET_GRADE:
      return state
        .set('grade', (action as IReviewSetGradeAction).grade);

    default:
      return state;
  }
}
