import { Map } from 'immutable';
import { Action } from 'redux';
import { IDeckCard } from '../models/firebase-models';

const REVIEW_SET_CURRENT = "SET_CURRENT";
const REVIEW_SELECT_GRADE = "SELECT_GRADE";

interface ISetCurrentAction extends Action {
  current: IDeckCard,
}

interface ISelectGradeAction extends Action {
  grade: number;
}

export function reviewSetCurrent(current: IDeckCard) {
  return {
    type: REVIEW_SET_CURRENT,
    current,
  }
}

export function reviewSelectGrade(grade: number) {
  return {
    type: REVIEW_SELECT_GRADE,
    grade,
  }
}

const initialReviewState = Map<string, any>({
  current: null,
  selectedGrade: 0,
});

export function review(state: Map<string, any> = initialReviewState, action: Action) : Map<string, any> {
  switch (action.type) {
    case REVIEW_SET_CURRENT:
      return state.set("current", (action as ISetCurrentAction).current);

    case REVIEW_SELECT_GRADE:
      return state.set("selectedGrade", (action as ISelectGradeAction).grade);

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
    case REVIEW_SET_CURRENT:
      return state.set('review', review(state.get('review'), action));
    
    default:
      return state;
  }
}