import { Action } from 'redux';

import {
  ICardHistory,
  IUserDeck,
} from '../../interfaces/firebase';

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