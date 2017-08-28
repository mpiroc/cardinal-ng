import { Map } from 'immutable';
import { Action } from 'redux';
import { ICardHistory, IUserDeck } from '../models/firebase-models';

export const REVIEW_SET_DECK = "REVIEW_SET_DECK";
export const REVIEW_SET_HISTORY = "REVIEW_SET_HISTORY";
export const REVIEW_SELECT_GRADE = "REVIEW_SELECT_GRADE";

export interface IReviewSetDeckAction extends Action {
  deck: IUserDeck,
}

export interface IReviewSetHistoryAction extends Action {
  history: ICardHistory,
}

export interface IReviewSelectGradeAction extends Action {
  grade: number;
}

export function reviewSetDeck(deck: IUserDeck) : IReviewSetDeckAction {
  return {
    type: REVIEW_SET_DECK,
    deck,
  }
}

export function reviewSetHistory(history: ICardHistory) : IReviewSetHistoryAction {
  return {
    type: REVIEW_SET_HISTORY,
    history,
  }
}

export function reviewSelectGrade(grade: number) : IReviewSelectGradeAction{
  return {
    type: REVIEW_SELECT_GRADE,
    grade,
  }
}

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

const initialComponentState = Map<string, any>({
  review: initialReviewState,
})

export function component(state: Map<string, any> = initialComponentState, action: Action) : Map<string, any> {
  switch (action.type) {
    case REVIEW_SELECT_GRADE:
    case REVIEW_SET_DECK:
    case REVIEW_SET_HISTORY:
      return state.set('review', review(state.get('review'), action));
    
    default:
      return state;
  }
}