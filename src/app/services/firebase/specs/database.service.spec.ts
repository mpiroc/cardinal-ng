import {
  instance,
  mock,
  verify,
  when,
  deepEqual,
  anything,
  anyOfClass,
  anyString,
} from 'ts-mockito'
import {
  FirebaseOperation,
} from 'angularfire2/database'
import { Observable } from 'rxjs/Observable'
import { Promise as FirebasePromise } from 'firebase'
import {
  IUser,
  IDeck,
  IDeckInfo,
  ICard,
  ICardContent,
  ICardHistory,
} from '../../../interfaces/firebase'
import {
  DatabaseService,
  DatabaseServiceImplementation,
} from '../database.service'
import {
  DatabaseShimService,
  DatabaseShimServiceImplementation,
  IFirebaseListObservable,
  IFirebaseObjectObservable,
} from '../database-shim.service'

class TestFirebaseListObservable<T> extends Observable<T> implements IFirebaseListObservable {
  push(val: any): firebase.database.ThenableReference { return null }
  update(item: FirebaseOperation, value: Object): firebase.Promise<void> { return null }
  remove(item?: FirebaseOperation): firebase.Promise<void> { return null }
  toPromise: <T>(this: Observable<T>) => Promise<T>
}

class TestFirebaseObjectObservable<T> extends Observable<T> implements IFirebaseObjectObservable {
  update(value: Object): firebase.Promise<void> { return null }
  remove(): firebase.Promise<void> { return null }
}

describe('services', () => {
  describe('DatabaseService', () => {
    let databaseShimServiceMock: DatabaseShimService
    let user: IUser
    let deck: IDeck
    let deckInfo: IDeckInfo
    let card: ICard
    let cardContent: ICardContent
    let cardHistory: ICardHistory

    let decks$Mock: Observable<IDeck[]> & IFirebaseListObservable
    let deckInfos$Mock: Observable<IDeckInfo[]> & IFirebaseListObservable
    let cards$Mock: Observable<ICard[]> & IFirebaseListObservable
    let cardContents$Mock: Observable<ICardContent[]> & IFirebaseListObservable
    let cardHistories$Mock: Observable<ICardHistory[]> & IFirebaseListObservable

    let deck$Mock: Observable<IDeck> & IFirebaseObjectObservable
    let deckInfo$Mock: Observable<IDeckInfo> & IFirebaseObjectObservable
    let card$Mock: Observable<ICard> & IFirebaseObjectObservable
    let cardContent$Mock: Observable<ICardContent> & IFirebaseObjectObservable
    let cardHistory$Mock: Observable<ICardHistory> & IFirebaseObjectObservable

    beforeEach(() => {
      databaseShimServiceMock = mock(DatabaseShimServiceImplementation)

      user = {
        uid: 'myUid',
      }
      deck = {
        ...user,
        deckId: 'myDeckId',
      }
      deckInfo = {
        ...deck,
        name: 'myName',
        description: 'myDescription',
      }
      card = {
        ...deck,
        cardId: 'myCardId',
      }
      cardContent = {
        ...card,
        front: 'myFront',
        back: 'myBack',
      }
      cardHistory = {
        ...card,
        difficulty: 2.5,
        grade: 0,
        repetitions: 0,
        previousReview: 0,
        nextReview: 0,
      }

      decks$Mock = mock(TestFirebaseListObservable)
      deckInfos$Mock = mock(TestFirebaseListObservable)
      cards$Mock = mock(TestFirebaseListObservable)
      cardContents$Mock = mock(TestFirebaseListObservable)
      cardHistories$Mock = mock(TestFirebaseListObservable)

      deck$Mock = mock(TestFirebaseObjectObservable)
      deckInfo$Mock = mock(TestFirebaseObjectObservable)
      card$Mock = mock(TestFirebaseObjectObservable)
      cardContent$Mock = mock(TestFirebaseObjectObservable)
      cardHistory$Mock = mock(TestFirebaseObjectObservable)

      when(decks$Mock.remove(deepEqual(deck))).thenReturn(FirebasePromise.resolve<void>())
      when(deckInfos$Mock.remove(deepEqual(deck))).thenReturn(FirebasePromise.resolve<void>())
      when(cards$Mock.remove(deepEqual(card))).thenReturn(FirebasePromise.resolve<void>())
      when(cardContents$Mock.remove(deepEqual(card))).thenReturn(FirebasePromise.resolve<void>())
      when(cardHistories$Mock.remove(deepEqual(card))).thenReturn(FirebasePromise.resolve<void>())

      when(decks$Mock.push(deepEqual(user))).thenReturn(FirebasePromise.resolve({ key: deck.deckId }))
      when(cards$Mock.push(deepEqual(deck))).thenReturn(FirebasePromise.resolve({ key: card.cardId }))

      when(deck$Mock.update(deepEqual(deck))).thenReturn(FirebasePromise.resolve<void>())
      when(deckInfo$Mock.update(deepEqual(deckInfo))).thenReturn(FirebasePromise.resolve<void>())
      when(card$Mock.update(deepEqual(card))).thenReturn(FirebasePromise.resolve<void>())
      when(cardContent$Mock.update(deepEqual(cardContent))).thenReturn(FirebasePromise.resolve<void>())
      when(cardHistory$Mock.update(deepEqual(cardHistory))).thenReturn(FirebasePromise.resolve<void>())

      when(decks$Mock.toPromise()).thenReturn(Promise.resolve([ deck ]))
      when(cards$Mock.toPromise()).thenReturn(Promise.resolve([ card ]))

      when(deck$Mock.toPromise()).thenReturn(Promise.resolve(deck))
      when(deckInfo$Mock.toPromise()).thenReturn(Promise.resolve(deckInfo))
      when(card$Mock.toPromise()).thenReturn(Promise.resolve(card))
      when(cardContent$Mock.toPromise()).thenReturn(Promise.resolve(cardContent))
      when(cardHistory$Mock.toPromise()).thenReturn(Promise.resolve(cardHistory))

      when(databaseShimServiceMock.list(`deck/${deck.uid}`))
        .thenReturn(instance(decks$Mock))
      when(databaseShimServiceMock.list(`deckInfo/${deck.uid}`))
        .thenReturn(instance(deckInfos$Mock))
      when(databaseShimServiceMock.list(`card/${deck.uid}/${deck.deckId}`))
        .thenReturn(instance(cards$Mock))
      when(databaseShimServiceMock.list(`cardContent/${deck.uid}/${deck.deckId}`))
        .thenReturn(instance(cardContents$Mock))
      when(databaseShimServiceMock.list(`cardHistory/${deck.uid}/${deck.deckId}`))
        .thenReturn(instance(cardHistories$Mock))

      when(databaseShimServiceMock.object(`deck/${deck.uid}/${deck.deckId}`))
        .thenReturn(instance(deck$Mock))
      when(databaseShimServiceMock.object(`deckInfo/${deck.uid}/${deck.deckId}`))
        .thenReturn(instance(deckInfo$Mock))
      when(databaseShimServiceMock.object(`card/${card.uid}/${card.deckId}/${card.cardId}`))
        .thenReturn(instance(card$Mock))
      when(databaseShimServiceMock.object(`cardContent/${card.uid}/${card.deckId}/${card.cardId}`))
        .thenReturn(instance(cardContent$Mock))
      when(databaseShimServiceMock.object(`cardHistory/${card.uid}/${card.deckId}/${card.cardId}`))
        .thenReturn(instance(cardHistory$Mock))
    })

    describe('create', () => {
      describe('createDeck', () => {
        it('creates deck in database', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.createDeck(user, deckInfo.name, deckInfo.description)

          verify(deck$Mock.update(deepEqual(deck))).once()

          done()
        })

        it('creates corresponding deckInfo in database', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.createDeck(user, deckInfo.name, deckInfo.description)

          verify(deckInfo$Mock.update(deepEqual(deckInfo))).once()

          done()
        })
      })

      describe('createCard', () => {
        it('creates card in database', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.createCard(deck, cardContent.front, cardContent.back)

          verify(card$Mock.update(deepEqual(card))).once()

          done()
        })

        it('creates corresponding cardContent in database', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.createCard(deck, cardContent.front, cardContent.back)

          verify(cardContent$Mock.update(deepEqual(cardContent))).once()

          done()
        })

        it('creates corresponding cardHistory in database', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.createCard(deck, cardContent.front, cardContent.back)

          verify(cardHistory$Mock.update(deepEqual(cardHistory))).once()

          done()
        })
      })
    })

    describe('retrieve', () => {
      describe('getDecks', () => {
        it('fetches data from database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          const fetchedDecks = await databaseService.getDecks(user).toPromise()

          expect(fetchedDecks).toEqual([ deck ])

          done()
        })
      })

      describe('getDeck', () => {
        it('fetches data from database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          const fetchedDeck = await databaseService.getDeck(deck).toPromise()

          expect(fetchedDeck).toEqual(deck)

          done()
        })
      })

      describe('getDeckInfo', () => {
        it('fetches data from database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          const fetchedDeckInfo = await databaseService.getDeckInfo(deck).toPromise()

          expect(fetchedDeckInfo).toEqual(deckInfo)

          done()
        })
      })

      describe('getCards', () => {
        it('fetches data from database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          const fetchedCards = await databaseService.getCards(deck).toPromise()

          expect(fetchedCards).toEqual([ card ])

          done()
        })
      })

      describe('getCard', () => {
        it('fetches data from database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          const fetchedCard = await databaseService.getCard(card).toPromise()

          expect(fetchedCard).toEqual(card)

          done()
        })
      })

      describe('getCardContent', () => {
        it('fetches data from database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          const fetchedCardContent = await databaseService.getCardContent(card).toPromise()

          expect(fetchedCardContent).toEqual(cardContent)

          done()
        })
      })

      describe('getCardHistory', () => {
        it('fetches data from database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          const fetchedCardHistory = await databaseService.getCardHistory(card).toPromise()

          expect(fetchedCardHistory).toEqual(cardHistory)

          done()
        })
      })
    })

    describe('update', () => {
      describe('updateDeck', () => {
        it('updates deck through database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.updateDeck(deck)

          verify(deck$Mock.update(deepEqual(deck))).once()

          done()
        })
      })

      describe('updateDeckInfo', () => {
        it('updates deckInfo through database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.updateDeckInfo(deck, deckInfo.name, deckInfo.description)

          verify(deckInfo$Mock.update(deepEqual(deckInfo))).once()

          done()
        })
      })

      describe('updateCard', () => {
        it('updates deck through database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.updateCard(card)

          verify(card$Mock.update(deepEqual(card))).once()

          done()
        })
      })

      describe('updateCardContent', () => {
        it('updates cardContent through database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.updateCardContent(card, cardContent.front, cardContent.back)

          verify(cardContent$Mock.update(deepEqual(cardContent))).once()

          done()
        })
      })

      describe('updateCardHistory', () => {
        it('updates cardHistory through database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.updateCardHistory(card,
            cardHistory.difficulty,
            cardHistory.grade,
            cardHistory.repetitions,
            cardHistory.previousReview,
            cardHistory.nextReview,
          )

          verify(cardHistory$Mock.update(deepEqual(cardHistory))).once()

          done()
        })
      })
    })

    describe('delete', () => {
      describe('deleteDeck', () => {
        it('deletes the deck through the database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.deleteDeck(deck)

          verify(decks$Mock.remove(deck.deckId)).once()

          done()
        })

        it('deletes the corresponding deckInfo through the database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.deleteDeck(deck)

          verify(deckInfos$Mock.remove(deck.deckId)).once()

          done()
        })
      })

      describe('deleteCard', () => {
        it('deletes the card through the database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.deleteCard(card)

          verify(cards$Mock.remove(card.cardId)).once()

          done()
        })

        it('deletes the corresponding cardContent through the database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.deleteCard(card)

          verify(cardContents$Mock.remove(card.cardId)).once()

          done()
        })

        it('deletes the corresponding cardHistory through the database service', async (done) => {
          const databaseService = new DatabaseServiceImplementation(
            instance(databaseShimServiceMock))

          await databaseService.deleteCard(card)

          verify(cardHistories$Mock.remove(card.cardId)).once()

          done()
        })
      })
    })
  })
})
