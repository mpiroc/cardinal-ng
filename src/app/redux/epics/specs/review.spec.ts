import { Map } from 'immutable'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { NgRedux } from '@angular-redux/store'
import { GradingService, GradingServiceImplementation } from '../../../services/grading.service'
import { LogService, LogServiceImplementation } from '../../../services/log.service'
import { RandomService, RandomServiceImplementation } from '../../../services/random.service'
import {
  ICard,
  ICardHistory,
  IDeck,
} from '../../../interfaces/firebase'
import {
  CardActions,
  CardHistoryActions,
} from '../../actions/firebase'
import {
  reviewSetDeck,
  reviewSetHistory,
  reviewSetGrade,
} from '../../actions/review'
import { ReviewEpic } from '../review'
import { IState } from '../../state'

import {
  instance,
  mock,
  when,
  deepEqual,
  anyString,
  anyNumber,
} from 'ts-mockito'
import { IStore } from 'redux-mock-store'
import { NgReduxExtension } from './ng-redux-extension'
import { configureMockStore, createMockState } from './configure-mock-store'

class Example {
  readonly deck: IDeck
  readonly cards: ICard[]
  readonly histories: ICardHistory[]
  readonly cards$ = new Subject<Map<string, ICard>>()
  readonly histories$: Subject<Map<string, any>>[];

  constructor(uid: string, deckId: string, cardIds: string[]) {
    this.deck = {
      uid,
      deckId,
    }
    this.cards = cardIds.map(cardId => ({
      ...this.deck,
      cardId,
    }))
    this.histories = this.cards.map(card => ({
      ...card,
      difficulty: 0,
      grade: 0,
      repetitions: 0,
      previousReview: 0,
      nextReview: 0,
    }))
    this.histories$ = this.histories.map(history => new Subject<Map<string, any>>());
  }

  nextCards(cards: ICard[]) {
    const cardsObject = cards.reduce((map, current) => {
      map[current.cardId] = current
      return map
    }, {})

    const cardsMap = Map<string, ICard>(cardsObject)
    this.cards$.next(cardsMap)
  }

  nextHistory(index: number, history: ICardHistory) {
    const historyMap = history ? Map<string, any>(history) : undefined
    this.histories$[index].next(Map<string, any>(historyMap))
  }
}

function expectEqual<T>(actual: T[], expected: T[]) {
  expect(actual.length).toEqual(expected.length)

  const maxLength = Math.max(actual.length, expected.length)
  for (let i = 0; i < maxLength; i++) {
    expect(actual[i]).toEqual(expected[i])
  }
}

describe('epics', ()=> {
  describe('review', () => {
    let errorMessages: string[]
    let logServiceMock: LogService
    let ngReduxMock: NgRedux<IState>
    let gradingServiceMock: GradingService
    let randomServiceMock: RandomService
    let cardActions: CardActions
    let cardHistoryActions: CardHistoryActions

    beforeEach(() => {
      errorMessages = []

      logServiceMock = mock(LogServiceImplementation)
      when(logServiceMock.error(anyString())).thenCall(message => errorMessages.push(message))

      ngReduxMock = mock(NgReduxExtension)
      gradingServiceMock = mock(GradingServiceImplementation)
      randomServiceMock = mock(RandomServiceImplementation)

      cardActions = new CardActions()
      cardHistoryActions = new CardHistoryActions()
    })

    describe('basic', () => {
      it('should clear selected card if deck has no cards', () => {
        const example = new Example('uid', 'myDeckId', [])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards([])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          reviewSetHistory(null),
        ])
      })

      it('should gracefully self-repair if card has no history', () => {
        pending('self-repair not yet implemented')

        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId', 'data']))).thenReturn(example.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, undefined)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          cardHistoryActions.beforeStartListening(example.cards[0]),
          reviewSetHistory(example.histories[0]),
        ])
      })

      it('should not choose a card if none due', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId', 'data']))).thenReturn(example.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(false)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards([ example.cards[0] ])
        example.nextHistory(0, example.histories[0])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          cardHistoryActions.beforeStartListening(example.cards[0]),
          reviewSetHistory(null),
        ])
      })

      it('should choose due card if only card is due', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId', 'data']))).thenReturn(example.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          cardHistoryActions.beforeStartListening(example.cards[0]),
          reviewSetHistory(example.histories[0]),
        ])
      })

      it('should choose due card if one is due and others are not due', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1', 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example.histories$[1])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(false)
        when(gradingServiceMock.isDue(deepEqual(example.histories[1]), anyNumber())).thenReturn(true)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        example.nextHistory(1, example.histories[1])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          cardHistoryActions.beforeStartListening(example.cards[0]),
          cardHistoryActions.beforeStartListening(example.cards[1]),
          reviewSetHistory(example.histories[1]),
        ])
      })

      it('should choose *random* due card if multiple are due', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1', 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example.histories$[1])
        when(ngReduxMock.getState()).thenReturn(createMockState())
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true)
        when(gradingServiceMock.isDue(deepEqual(example.histories[1]), anyNumber())).thenReturn(true)
        when(randomServiceMock.random()).thenReturn(0.5)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        example.nextHistory(1, example.histories[1])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          cardHistoryActions.beforeStartListening(example.cards[0]),
          cardHistoryActions.beforeStartListening(example.cards[1]),
          reviewSetHistory(example.histories[1]),
        ])
      })
    })

    describe('card changes', () => {
      it('should select new card if none were due, then a due card is added', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1', 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example.histories$[1])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(false)
        when(gradingServiceMock.isDue(deepEqual(example.histories[1]), anyNumber())).thenReturn(true)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards([ example.cards[0] ])
        example.nextHistory(0, example.histories[0])
        store.clearActions();

        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        example.nextHistory(1, example.histories[1])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardHistoryActions.beforeStartListening(example.cards[0]),
          cardHistoryActions.beforeStartListening(example.cards[1]),
          reviewSetHistory(example.histories[1]),
        ])
      })

      it('should clear selected card if one is selected, then only due card is removed', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId', 'data']))).thenReturn(example.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards([ example.cards[0] ])
        example.nextHistory(0, example.histories[0])
        store.clearActions();

        example.nextCards([])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetHistory(null),
        ])
      })

      it('should select new card if one is selected, then another due card is added', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1', 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example.histories$[1])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true)
        when(gradingServiceMock.isDue(deepEqual(example.histories[1]), anyNumber())).thenReturn(true)

        const mockState = createMockState()
        mockState.review = mockState.review.set('history', example.histories[0])
        when(ngReduxMock.getState()).thenReturn(mockState)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        example.nextHistory(1, example.histories[1])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          cardHistoryActions.beforeStartListening(example.cards[0]),
          cardHistoryActions.beforeStartListening(example.cards[1]),
          reviewSetHistory(example.histories[1]),
        ])
      })

      it('should select other card if two are due, then selected card is removed', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1', 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example.histories$[1])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true)
        when(gradingServiceMock.isDue(deepEqual(example.histories[1]), anyNumber())).thenReturn(true)
        when(randomServiceMock.random()).thenReturn(0)

        const mockState = createMockState()
        when(ngReduxMock.getState()).thenReturn(mockState, {
          ...mockState,
          review: mockState.review.set('history', example.histories[0]),
        })

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        example.nextHistory(1, example.histories[1])
        store.clearActions();

        example.nextCards([ example.cards[1] ])
        example.nextHistory(1, example.histories[1])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          cardHistoryActions.beforeStartListening(example.cards[1]),
          reviewSetHistory(example.histories[1]),
        ])
      })

      it('should not respond to changes to cards in previously selected deck', () => {
        const example1 = new Example('uid', 'myDeckId1', [ 'myCardId1' ])
        const example2 = new Example('uid', 'myDeckId2', [ 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId1', 'data']))).thenReturn(example1.cards$)
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId2', 'data']))).thenReturn(example2.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example1.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example2.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example1.histories[0]), anyNumber())).thenReturn(true)
        when(gradingServiceMock.isDue(deepEqual(example2.histories[0]), anyNumber())).thenReturn(true)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example1.deck))
        example1.nextCards(example1.cards)
        example1.nextHistory(0, example1.histories[0])
        store.dispatch(reviewSetDeck(example2.deck))
        example2.nextCards(example2.cards)
        example2.nextHistory(0, example2.histories[0])
        store.clearActions()

        example1.nextCards([])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [])
      })
    })

    describe('history changes', () => {
      it('should select other card if two are due, then current becomes not-due', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1', 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example.histories$[1])
        when(ngReduxMock.getState()).thenReturn(createMockState())
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true, false)
        when(gradingServiceMock.isDue(deepEqual(example.histories[1]), anyNumber())).thenReturn(true)
        when(randomServiceMock.random()).thenReturn(0)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        example.nextHistory(1, example.histories[1])
        store.clearActions()

        example.nextHistory(0, example.histories[0])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetHistory(example.histories[1])
        ])
      })

      it('should select same card if one is due, then its history is updated but it is still due', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        store.clearActions()

        example.nextHistory(0, example.histories[0])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetHistory(example.histories[0])
        ])
      })

      it('should unselect card if one is due, then it becomes not-due', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId', 'data']))).thenReturn(example.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true, false)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        store.clearActions()

        example.nextHistory(0, example.histories[0])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          reviewSetHistory(null)
        ])
      })

      it('should not respond to changes to histories of cards previously in selected deck', () => {
        const example = new Example('uid', 'myDeckId', [ 'myCardId1', 'myCardId2' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId1', 'data']))).thenReturn(example.histories$[0])
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId2', 'data']))).thenReturn(example.histories$[1])
        when(ngReduxMock.getState()).thenReturn(createMockState())
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenReturn(true, false)
        when(gradingServiceMock.isDue(deepEqual(example.histories[1]), anyNumber())).thenReturn(true)
        when(randomServiceMock.random()).thenReturn(0)

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])
        example.nextHistory(1, example.histories[1])
        example.nextCards([ example.cards[1] ])
        example.nextHistory(1, example.histories[1])
        store.clearActions()

        example.nextHistory(0, example.histories[0])

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [])
      })
    })

    describe('errors', () => {
      it('should throw uncaught error if log services throws an error', () => {
        pending();
        //when(logServiceMock.error(anyString())).thenThrow(new Error('error message'))
      })

      it('should log error in log service and state if cards store throws an error', () => {
        pending('Store error in state is not yet implemented')

        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenThrow(new Error('error message'))

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))

        expectEqual(errorMessages, [ 'error message' ])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          { type: 'REVIEW_ERROR', error: 'error message' },
        ])
      })

      it('should log error in log service and state if histories store throws an error', () => {
        pending('Store error in state is not yet implemented')

        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId', 'data']))).thenThrow(new Error('error message'))

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)

        expectEqual(errorMessages, [ 'error message' ])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          { type: 'REVIEW_ERROR', error: 'error message' },
        ])
      })

      it('should log error in log service and state if grading service throws an error', () => {
        pending('Store error in state is not yet implemented')

        const example = new Example('uid', 'myDeckId', [ 'myCardId' ])
        when(ngReduxMock.select(deepEqual(['card', 'myDeckId', 'data']))).thenReturn(example.cards$)
        when(ngReduxMock.select(deepEqual(['cardHistory', 'myCardId', 'data']))).thenReturn(example.histories$[0])
        when(gradingServiceMock.isDue(deepEqual(example.histories[0]), anyNumber())).thenThrow(new Error('error message'))

        const epic = new ReviewEpic(
          instance(logServiceMock),
          instance(ngReduxMock),
          instance(gradingServiceMock),
          instance(randomServiceMock),
          cardActions,
          cardHistoryActions,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(reviewSetDeck(example.deck))
        example.nextCards(example.cards)
        example.nextHistory(0, example.histories[0])

        expectEqual(errorMessages, [ 'error message' ])
        expectEqual(store.getActions(), [
          reviewSetDeck(example.deck),
          cardActions.beforeStartListening(example.deck),
          cardHistoryActions.beforeStartListening(example.cards[0]),
          { type: 'REVIEW_ERROR', error: 'error message' },
        ])
      })

      it('should not halt epic when error is thrown and caught', () => {
        pending('graceful epic recovery not yet implemented')
      })
    })
  })
})
