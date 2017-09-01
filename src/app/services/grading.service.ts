import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Promise as FirebasePromise } from 'firebase';
import * as moment from 'moment';

import { DatabaseService } from './firebase/database.service';
import { ICardHistory } from '../interfaces/firebase';
import { IState } from '../redux/state';

const MINIMUM_DIFFICULTY = 1.3;
const MINIMUM_CORRECT_GRADE = 3;

@Injectable()
export class GradingService {
  constructor(private ngRedux: NgRedux<IState>, private databaseService: DatabaseService) {
  }

  isDue(history: ICardHistory, nowMs: number) : boolean {
    return history.grade < MINIMUM_CORRECT_GRADE || !history.nextReview || nowMs >= history.nextReview;
  }

  submitGrade() : FirebasePromise<void> {
    const now = moment.now();

    const state: IState = this.ngRedux.getState();
    const history: ICardHistory = state.review.get('history');
    const grade: number = state.review.get('grade');

    const difficulty = this.computeDifficulty(history, grade);
    const repetitions = this.computeRepetitions(history, grade);
    const nextReview = this.computeNextReview(history, difficulty, repetitions, now);

    return this.databaseService.updateCardHistory(
      history,
      difficulty,
      grade,
      repetitions,
      now,
      nextReview,
    );
  }

  private computeDifficulty(history: ICardHistory, grade: number) : number {
    if (history.grade < MINIMUM_CORRECT_GRADE) {
      return history.difficulty;
    }

    const result = history.difficulty - 0.8 + 0.28 * grade - 0.02 * grade * grade;

    return Math.max(result, MINIMUM_DIFFICULTY);
  }

  private computeRepetitions(history: ICardHistory, grade: number) : number {
    if (grade < MINIMUM_CORRECT_GRADE) {
      return 0;
    }

    return history.repetitions + 1;
  }

  private computeNextReview(history: ICardHistory, difficulty: number, repetitions: number, now: number) {
    if (repetitions === 0) {
      return now + moment.duration(0, 'days').asMilliseconds();
    }

    if (repetitions === 1) {
      return now + moment.duration(1, 'days').asMilliseconds();
    }

    if (repetitions === 2) {
      return now + moment.duration(6, 'days').asMilliseconds();
    }

    const previousInterval = Math.max(0, now - history.previousReview);

    return now + previousInterval * difficulty;
  }
}