import { Action } from 'redux';

import {
  ICardHistory,
  IDeck,
} from '../../interfaces/firebase';

export const REVIEW_SET_DECK = 'REVIEW_SET_DECK';
export const REVIEW_SET_HISTORY = 'REVIEW_SET_HISTORY';
export const REVIEW_SET_GRADE = 'REVIEW_SET_GRADE';

export interface IReviewSetDeckAction extends Action {
  deck: IDeck,
}

export interface IReviewSetHistoryAction extends Action {
  history: ICardHistory,
}

export interface IReviewSetGradeAction extends Action {
  grade: number;
}

export function reviewSetDeck(deck: IDeck): IReviewSetDeckAction {
  return {
    type: REVIEW_SET_DECK,
    deck,
  }
}

export function reviewSetHistory(history: ICardHistory): IReviewSetHistoryAction {
  return {
    type: REVIEW_SET_HISTORY,
    history,
  }
}

export function reviewSetGrade(grade: number): IReviewSetGradeAction {
  return {
    type: REVIEW_SET_GRADE,
    grade,
  }
}
