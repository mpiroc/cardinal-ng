import { Map } from 'immutable';
import { Action } from 'redux';
import {
  REVIEW_SET_DECK,
  REVIEW_SET_HISTORY,
  REVIEW_SELECT_GRADE,
  IReviewSetDeckAction,
  IReviewSetHistoryAction,
  IReviewSelectGradeAction,
} from '../actions/review';

const initialReviewState = Map<string, any>({
  deck: null,
  history: null,
  grade: 0,
});

export function review(state: Map<string, any> = initialReviewState, action: Action) : Map<string, any> {
  switch (action.type) {
    case REVIEW_SET_DECK:
      return state
        .set("deck", (action as IReviewSetDeckAction).deck);

    case REVIEW_SET_HISTORY:
      return state
        .set("history", (action as IReviewSetHistoryAction).history)
        .set("grade", 0);

    case REVIEW_SELECT_GRADE:
      return state
        .set("grade", (action as IReviewSelectGradeAction).grade);

    default:
      return state;
  }
}