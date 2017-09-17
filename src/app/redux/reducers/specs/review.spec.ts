import {
  reviewSetDeck,
  reviewSetHistory,
  reviewSetGrade,
} from '../../actions/review'
import {
  review,
} from '../review'

describe('reducers', () => {
  describe('review', () => {
    const exampleDeck = {
      uid: 'myUid',
      deckId: 'myDeckId',
    }
    const exampleHistory = {
      uid: 'myUid',
      deckId: 'myDeckId',
      cardId: 'myCardId',
      difficulty: 1,
      grade: 2,
      repetitions: 3,
      previousReview: 4,
      nextReview: 5,
    }

    describe('initialState', () => {
      it('should initialize all properties', () => {
        const state = review(undefined, { type: '@@TEST' })
        expect(state).toBeTruthy()
        expect(state.has('isLoading')).toBeTruthy()
        expect(state.get('isLoading')).toBeTruthy()
        expect(state.has('deck')).toBeTruthy()
        expect(state.get('deck')).toBeNull()
        expect(state.has('history')).toBeTruthy()
        expect(state.get('history')).toBeNull()
        expect(state.has('grade')).toBeTruthy()
        expect(state.get('grade')).toEqual(0)
      })
    })
    describe('setDeck', () => {
      it('should update deck in state', () => {
        const state = review(undefined, reviewSetDeck(exampleDeck))
        expect(state.get('deck')).toEqual(exampleDeck)
      })
      it('should mark state as loading', () => {
        let state = review(undefined, { type: '@@TEST' })
          .set('isLoading', false)
        state = review(state, reviewSetDeck(exampleDeck))
        expect(state.get('isLoading')).toEqual(true)
      })
      it('should clear previous history from state', () => {
        let state = review(undefined, { type: '@@TEST' })
          .set('history', exampleHistory)
        state = review(state, reviewSetDeck(exampleDeck))
      })
    })
    describe('setHistory', () => {
      it('should update history in state', () => {
        const state = review(undefined, reviewSetHistory(exampleHistory))
        expect(state.get('history')).toEqual(exampleHistory)
      })
      it('should mark state as finished loading', () => {
        const state = review(undefined, reviewSetHistory(exampleHistory))
        expect(state.get('isLoading')).toEqual(false)
      })
      it('should set grade to history\'s previous grade', () => {
        const state = review(undefined, reviewSetHistory(exampleHistory))
        expect(state.get('grade')).toEqual(2)
      })
      it('should reset grade if not previous grade in history', () => {
        const state = review(undefined, reviewSetHistory({
          ...exampleHistory,
          grade: undefined,
        }))
        expect(state.get('grade')).toEqual(0)
      })
    })
    describe('setGrade', () => {
      it('should update grade in state', () => {
        const state = review(undefined, reviewSetGrade(4))
        expect(state.get('grade')).toEqual(4)
      })
    })
  })
})
