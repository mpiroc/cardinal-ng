// Attribution: Algorithm from https://www.supermemo.com/english/ol/sm2.htm

import { Injectable } from '@angular/core'
import { NgRedux } from '@angular-redux/store'
import * as moment from 'moment'

import { DatabaseService } from './firebase/database.service'
import { ICardHistory } from '../interfaces/firebase'
import { IState } from '../redux/state'

const MINIMUM_DIFFICULTY = 1.3
const MINIMUM_CORRECT_GRADE = 3

export abstract class GradingService {
  abstract isDue(history: ICardHistory, nowMs: number): boolean
  abstract submitGrade(nowMs: number): Promise<void>
}

@Injectable()
export class GradingServiceImplementation extends GradingService {
  constructor(private ngRedux: NgRedux<IState>, private databaseService: DatabaseService) {
    super()
  }

  isDue(history: ICardHistory, nowMs: number): boolean {
    return history.grade < MINIMUM_CORRECT_GRADE || !history.nextReview || nowMs >= history.nextReview
  }

  submitGrade(nowMs: number): Promise<void> {
    const state: IState = this.ngRedux.getState()
    const history: ICardHistory = state.review.get('history')
    const grade: number = state.review.get('grade')

    const difficulty = this.computeDifficulty(history, grade)
    const repetitions = this.computeRepetitions(history, grade)
    const nextReview = this.computeNextReview(history, difficulty, repetitions, nowMs)

    return this.databaseService.updateCardHistory(
      history,
      difficulty,
      grade,
      repetitions,
      nowMs,
      nextReview,
    )
  }

  private computeDifficulty(history: ICardHistory, grade: number): number {
    const result = this.computeUnboundedDifficulty(history.difficulty, grade)

    return Math.max(result, MINIMUM_DIFFICULTY)
  }

  private computeUnboundedDifficulty(difficulty: number, grade: number) {
    // EF' := EF - 0.8 + 0.28 * q - 0.02 * q * q
    switch (grade) {
      case 3:
        return difficulty - 0.14

      case 4:
        return difficulty

      case 5:
        return difficulty + 0.10

      default:
        return difficulty
    }
  }

  private computeRepetitions(history: ICardHistory, grade: number): number {
    if (grade < MINIMUM_CORRECT_GRADE) {
      return 0
    }

    return history.repetitions + 1
  }

  private computeNextReview(history: ICardHistory, difficulty: number, repetitions: number, now: number) {
    if (repetitions === 0) {
      return now + moment.duration(0, 'days').asMilliseconds()
    }

    if (repetitions === 1) {
      return now + moment.duration(1, 'days').asMilliseconds()
    }

    if (repetitions === 2) {
      return now + moment.duration(6, 'days').asMilliseconds()
    }

    const previousInterval = Math.max(0, now - history.previousReview)

    return now + previousInterval * difficulty
  }
}
