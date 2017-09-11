import {
  REVIEW_SET_DECK,
  REVIEW_SET_HISTORY,
  REVIEW_SET_GRADE,
  reviewSetDeck,
  reviewSetHistory,
  reviewSetGrade,
} from '../review';

describe('actions', () => {
  describe('review', () => {
    describe('setDeck', () => {
      it('should create a valid action', () => {
        const deck = {
          uid: 'uid',
          deckId: 'deckId',
        };
        const result = reviewSetDeck(deck);
        expect(result.type).toEqual(REVIEW_SET_DECK);
        expect(result.deck).toEqual(deck);
      })
    }),
    describe('setHistory', () => {
      it('should create a valid action', () => {
        const history = {
          uid: 'uid',
          deckId: 'deckId',
          cardId: 'cardId',
          difficulty: 1,
          grade: 2,
          repetitions: 3,
          previousReview: 4,
          nextReview: 5,
        };
        const result = reviewSetHistory(history);
        expect(result.type).toEqual(REVIEW_SET_HISTORY);
        expect(result.history).toEqual(history);
      })
    }),
    describe('setGrade', () => {
      it('should create a valid action', () => {
        const result = reviewSetGrade(42);
        expect(result.type).toEqual(REVIEW_SET_GRADE);
        expect(result.grade).toEqual(42);
      })
    })
  })
})