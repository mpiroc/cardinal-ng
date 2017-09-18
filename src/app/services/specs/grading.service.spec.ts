import { Map } from 'immutable'
import { NgRedux } from '@angular-redux/store'
import * as moment from 'moment'
import { NgReduxExtension } from '../../redux/epics/specs/ng-redux-extension'
import { IState } from '../../redux/state'
import { ICardHistory } from '../../interfaces/firebase'
import { DatabaseService, DatabaseServiceImplementation } from '../firebase/database.service'
import { GradingService, GradingServiceImplementation } from '../grading.service'

import {
  instance,
  mock,
  verify,
  when,
  deepEqual,
  anything,
  anyNumber,
  anyOfClass,
  anyString,
} from 'ts-mockito'

describe('services', () => {
  describe('GradingService', () => {
    let emptyHistory: ICardHistory

    beforeEach(() => {
      emptyHistory = {
        uid: undefined,
        deckId: undefined,
        cardId: undefined,
        difficulty: undefined,
        grade: undefined,
        repetitions: undefined,
        previousReview: undefined,
        nextReview: undefined,
      }
    })
    describe('isDue', () => {
      let gradingService: GradingService

      beforeEach(() => {
        gradingService = new GradingServiceImplementation(null, null)
      })

      it('returns true if card has never been reviewed', () => {
        const history: ICardHistory = {
          ...emptyHistory,
          grade: 5,
        }

        const result: boolean = gradingService.isDue(history, 1)

        expect(result).toEqual(true)
      })

      it('returns true if card\'s next review date is in the past', () => {
        const history: ICardHistory = {
          ...emptyHistory,
          grade: 5,
          previousReview: 0,
          nextReview: 1,
        }

        const result: boolean = gradingService.isDue(history, Number.MAX_SAFE_INTEGER)

        expect(result).toEqual(true)
      })

      it('returns true if user\'s previous response was incorrect', () => {
        const history: ICardHistory = {
          ...emptyHistory,
          grade: 2,
          previousReview: 0,
          nextReview: Number.MAX_SAFE_INTEGER,
        }

        const result: boolean = gradingService.isDue(history, 1)

        expect(result).toEqual(true)
      })

      it('returns false otherwise', () => {
        const history: ICardHistory = {
          ...emptyHistory,
          grade: 5,
          previousReview: 0,
          nextReview: Number.MAX_SAFE_INTEGER,
        }

        const result: boolean = gradingService.isDue(history, 1)

        expect(result).toEqual(false)
      })
    })

    describe('submitGrade', () => {
      let ngReduxMock: NgRedux<IState>
      let databaseServiceMock: DatabaseService
      let newDifficulty: number
      let newRepetitions: number
      let newNextReview: number

      beforeEach(() => {
        ngReduxMock = mock(NgReduxExtension)
        databaseServiceMock = mock(DatabaseServiceImplementation)
        newDifficulty = undefined
        when(databaseServiceMock.updateCardHistory(
          anything(),
          anyNumber(),
          anyNumber(),
          anyNumber(),
          anyNumber(),
          anyNumber(),
        ))
          .thenCall((
              args: any,
              difficulty: number,
              grade: number,
              repetitions: number,
              previousReview: number,
              nextReview: number,
            ) => {
              newDifficulty = difficulty
              newRepetitions = repetitions
              newNextReview = nextReview
            }
          )
          .thenReturn(Promise.resolve())
      })

      describe('difficulty', () => {
        it('does not change on incorrect response', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 0,
                previousReview: 0,
              },
              grade: 0,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newDifficulty).toEqual(3)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('does not drop below the minimum difficulty', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 1.35,
                repetitions: 0,
                previousReview: 0,
              },
              grade: 3,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newDifficulty).toEqual(1.3)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('descreases on 3', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 0,
                previousReview: 0,
              },
              grade: 3,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newDifficulty).toBeLessThan(3)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('does not change on 4', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 0,
                previousReview: 0,
              },
              grade: 4,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newDifficulty).toEqual(3)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('increases on 5', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 0,
                previousReview: 0,
              },
              grade: 5,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newDifficulty).toBeGreaterThan(3)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })
      })

      describe('repetitions', () => {
        it('resets on incorrect response', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 1,
                previousReview: 0,
              },
              grade: 0,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newRepetitions).toEqual(0)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('increments on correct response', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 1,
                previousReview: 0,
              },
              grade: 3,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newRepetitions).toEqual(2)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })
      })

      describe('nextReview', () => {
        it('is now if response was incorrect', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 0,
                previousReview: 0,
              },
              grade: 2,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newNextReview).toEqual(0)
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('is one day from now if response is the first successive correct response', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 0,
                previousReview: 0,
              },
              grade: 4,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newNextReview).toEqual(moment.duration(1, 'days').asMilliseconds())
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('is six days from now if response is the second successive correct response', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 1,
                previousReview: 0,
              },
              grade: 4,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          await gradingService.submitGrade(0)

          expect(newNextReview).toEqual(moment.duration(6, 'days').asMilliseconds())
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })

        it('is scaled by the card\'s difficulty if response is the third or later successive correct response', async (done) => {
          when(ngReduxMock.getState()).thenReturn({
            review: Map<string, any>({
              history: {
                ...emptyHistory,
                difficulty: 3,
                repetitions: 2,
                previousReview: 0,
              },
              grade: 4,
            })
          })

          const gradingService: GradingService = new GradingServiceImplementation(
            instance(ngReduxMock),
            instance(databaseServiceMock),
          )

          const now: number = 100
          await gradingService.submitGrade(now)

          expect(newNextReview).toEqual(now + 3 * (now - 0))
          verify(databaseServiceMock.updateCardHistory(
            anything(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
            anyNumber(),
          )).once()

          done()
        })
      })
    })
  })
})