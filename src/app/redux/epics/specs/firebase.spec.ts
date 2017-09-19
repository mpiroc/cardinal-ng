import { Map } from 'immutable'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/observable/of'
import { Action } from 'redux'

import { AuthShimService, AuthShimServiceImplementation } from '../../../services/firebase/auth-shim.service'
import { DatabaseService, DatabaseServiceImplementation } from '../../../services/firebase/database.service'
import { LogService, LogServiceImplementation } from '../../../services/log.service'
import {
  IUser,
  ICardContent,
  ICardHistory,
  ICard,
  IDeckInfo,
  IDeck,
} from '../../../interfaces/firebase'
import {
  IListReceivedAction,
  FirebaseActions,
  CardContentActions,
  CardHistoryActions,
  CardActions,
  DeckInfoActions,
  DeckActions,
  UserActions,
} from '../../actions/firebase'
import {
  FirebaseObjectEpic,
  FirebaseListEpic,
  CardContentEpic,
  CardHistoryEpic,
  CardEpic,
  DeckInfoEpic,
  DeckEpic,
  UserEpic,
} from '../firebase'
import { IState } from '../../state'
import {
  instance,
  mock,
  when,
  deepEqual,
  anything,
  anyString,
} from 'ts-mockito'
import { IStore } from 'redux-mock-store'
import { AngularFireAuth } from 'angularfire2/auth'
import {
  expectEqual,
  configureMockStore,
  createMockState,
} from '../../../utils/test-utils.spec'

interface IArgs {
  id: string
}

interface IModel extends IArgs {
  content: string
}

class TestFirebaseActions extends FirebaseActions<IModel, IArgs> {
  constructor() {
    super('TEST')
  }
}

class TestFirebaseObjectEpic extends FirebaseObjectEpic<IModel, IArgs> {
  constructor(
    actions: FirebaseActions<IModel, IArgs>,
    logService: LogService,
    private subStore: Map<string, any>,
    private fetchFunc: (args: IArgs) => Observable<IModel>,
  ) {
    super(actions, logService)
  }

  protected selectSubStore(state: IState, args: IArgs): Map<string, any> {
    return this.subStore
  }

  protected fetch(args: IArgs): Observable<IModel> {
    return this.fetchFunc(args)
  }
}

class TestFirebaseListEpic extends FirebaseListEpic<IModel, IArgs> {
  constructor(
    actions: FirebaseActions<IModel, IArgs>,
    logService: LogService,
    private subStore: Map<string, any>,
    private fetchFunc: (args: IArgs) => Observable<IModel[]>,
  ) {
    super(actions, logService)
  }

  protected selectSubStore(state: IState, args: IArgs): Map<string, any> {
    return this.subStore
  }

  protected selectKey(data: IModel): string {
    return data.id
  }

  protected getStopActions(masterRecord: IModel): Action[] {
    return [
      { type: 'ADDITIONAL_STOP_ACTION' }
    ]
  }

  protected fetch(args: IArgs): Observable<IModel[]> {
    return this.fetchFunc(args)
  }
}

describe('epics', () => {
  describe('firebase', () => {
    let errorMessages: string[]
    let logServiceMock: LogService

    beforeEach(() => {
      errorMessages = []

      logServiceMock = mock(LogServiceImplementation)
      when(logServiceMock.error(anyString())).thenCall(message => {
        errorMessages.push(message)
      })
    })

    describe('object', () => {
      let actions: FirebaseActions<IModel, IArgs>
      let args: IArgs
      let model: IModel
      let fetchSubject: Subject<IModel>

      beforeEach(() => {
        actions = new TestFirebaseActions()
        args = { id: 'myId '}
        model = {
          ...args,
          content: 'myContent',
        }
        fetchSubject = new Subject<IModel>()
      })

      it('dispatches START_LISTENING immediately after each BEFORE_START_LISTENING action', () => {
        const epic = new TestFirebaseObjectEpic(
          actions,
          instance(logServiceMock),
          Map<string, any>(),
          args => fetchSubject,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
        ])
      })

      it('ignores BEFORE_START_LISTENING actions for items that are already listening', () => {
        const epic = new TestFirebaseObjectEpic(
          actions,
          instance(logServiceMock),
          Map<string, any>({
            isListening: true,
          }),
          args => fetchSubject,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
        ])
      })

      it('dispatches OBJECT_RECEIVED after each fetch result', () => {
        const epic = new TestFirebaseObjectEpic(
          actions,
          instance(logServiceMock),
          Map<string, any>(),
          args => fetchSubject,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        fetchSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, model),
        ])
      })

      it('ignores fetch results received after STOP_LISTENING', () => {
        const epic = new TestFirebaseObjectEpic(
          actions,
          instance(logServiceMock),
          Map<string, any>(),
          args => fetchSubject,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        fetchSubject.next(model)
        store.clearActions()

        store.dispatch(actions.stopListening(args))
        fetchSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.stopListening(args),
        ])
      })

      it('ignores STOP_LISTENING if args don\'t match', () => {
        const epic = new TestFirebaseObjectEpic(
          actions,
          instance(logServiceMock),
          Map<string, any>(),
          args => fetchSubject,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        fetchSubject.next(model)
        store.clearActions()

        store.dispatch(actions.stopListening({ id: 'myId2' }))
        fetchSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.stopListening({ id: 'myId2' }),
          actions.objectReceived(args, model),
        ])
      })

      it('catches each fetch error, logs it, and dispatches an ERROR action', () => {
        const epic = new TestFirebaseObjectEpic(
          actions,
          instance(logServiceMock),
          Map<string, any>(),
          args => fetchSubject,
        )

        const store = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        fetchSubject.error(new Error('myError'))

        expectEqual(errorMessages, [
          'myError'
        ])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.error(args, 'myError'),
        ])
      })
    })

    describe('list', () => {
      let actions: FirebaseActions<IModel, IArgs>
      let args: IArgs
      let model: IModel
      let fetchSubject: Subject<IModel[]>

      beforeEach(() => {
        actions = new TestFirebaseActions()
        args = { id: 'myId '}
        model = {
          ...args,
          content: 'myContent',
        }
        fetchSubject = new Subject<IModel[]>()
      })

      describe('epic', () => {
        it('dispatches START_LISTENING immediately after each BEFORE_START_LISTENING action', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>(),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStartListening(args),
            actions.startListening(args),
          ])
        })

        it('ignores BEFORE_START_LISTENING actions for items that are already listening', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>({
              isListening: true,
            }),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStartListening(args),
          ])
        })

        it('dispatches LIST_RECEIVED after each fetch result', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>(),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))
          fetchSubject.next([ model ])

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStartListening(args),
            actions.startListening(args),
            actions.listReceived(args, [ model ]),
          ])
        })

        it('ignores fetch results received after STOP_LISTENING', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>(),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))
          fetchSubject.next([ model ])
          store.clearActions()

          store.dispatch(actions.stopListening(args))
          fetchSubject.next([ model ])

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.stopListening(args),
          ])
        })

        it('ignores STOP_LISTENING if args don\'t match', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>(),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))
          fetchSubject.next([ model ])
          store.clearActions()

          store.dispatch(actions.stopListening({ id: 'myId2' }))
          fetchSubject.next([ model ])

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.stopListening({ id: 'myId2' }),
            actions.listReceived(args, [ model ]),
          ])
        })

        it('catches each fetch error, logs it, and dispatches an ERROR action', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>(),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))
          fetchSubject.error(new Error('myError'))

          expectEqual(errorMessages, [
            'myError'
          ])
          expectEqual(store.getActions(), [
            actions.beforeStartListening(args),
            actions.startListening(args),
            actions.error(args, 'myError'),
          ])
        })

        it('dispatches additional STOP_LISTENING actions for each item removed from the list', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>({
              data: Map<string, IModel>({
                [model.id]: model,
              }),
            }),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))
          fetchSubject.next([])

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStartListening(args),
            actions.startListening(args),
            actions.listReceived(args, []),
            { type: 'ADDITIONAL_STOP_ACTION' },
          ])
        })

        it('does not dispatch additional STOP_LISTENING actions if there was no previous data for this list', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>(),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))
          fetchSubject.next([])

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStartListening(args),
            actions.startListening(args),
            actions.listReceived(args, []),
          ])
        })

        it('does not dispatch additional STOP_LISTENING actions for items that remain in the list', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>({
              data: Map<string, IModel>({
                [model.id]: model,
              }),
            }),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.epic)
          store.dispatch(actions.beforeStartListening(args))
          fetchSubject.next([ model ])

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStartListening(args),
            actions.startListening(args),
            actions.listReceived(args, [model]),
          ])
        })
      })

      describe('stopListeningEpic', () => {
        it('dispatches additional STOP_LISTENING actions for each item in the list', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>({
              data: Map<string, IModel>({
                [model.id]: model,
              }),
            }),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.stopListeningEpic)
          store.dispatch(actions.beforeStopListening(args))

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStopListening(args),
            actions.stopListening(args),
            { type: 'ADDITIONAL_STOP_ACTION' },
          ])
        })

        it('does not dispatch additional STOP_LISTENING actions if there was no previous data for this list', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>(),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.stopListeningEpic)
          store.dispatch(actions.beforeStopListening(args))

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStopListening(args),
            actions.stopListening(args),
          ])
        })

        it('does not dispatch additional STOP_LISTENING actions if list is empty', () => {
          const epic = new TestFirebaseListEpic(
            actions,
            instance(logServiceMock),
            Map<string, any>({
              data: Map<string, IModel>(),
            }),
            args => fetchSubject,
          )

          const store = configureMockStore(epic.stopListeningEpic)
          store.dispatch(actions.beforeStopListening(args))

          expectEqual(errorMessages, [])
          expectEqual(store.getActions(), [
            actions.beforeStopListening(args),
            actions.stopListening(args),
          ])
        })
      })
    })

    describe('card-content', () => {
      let actions: CardContentActions
      let databaseServiceMock: DatabaseService
      let args: ICard
      let model: ICardContent
      let modelSubject: Subject<ICardContent>
      let epic: CardContentEpic

      beforeEach(() => {
        actions = new CardContentActions()
        databaseServiceMock = mock(DatabaseServiceImplementation)
        args = {
          uid: 'myUid',
          deckId: 'myDeckId',
          cardId: 'myCardId',
        }
        model = {
          ...args,
          front: 'myFront',
          back: 'myBack',
        }
        modelSubject = new Subject<ICardContent>()
        when(databaseServiceMock.getCardContent(deepEqual(args)))
          .thenReturn(modelSubject)

        epic = new CardContentEpic(
          actions,
          instance(logServiceMock),
          instance(databaseServiceMock),
        )
      })

      it('selects correct substore', () => {
        const store: IStore<IState> = configureMockStore(epic.epic, createMockState({
          cardContent: Map<string, any>({
            'myCardId': Map<string, any>({
              isListening: true,
            })
          })
        }))

        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
        ])
      })

      it('fetches model from database service', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, model),
        ])
      })
    })

    describe('card-history', () => {
      let actions: CardHistoryActions
      let databaseServiceMock: DatabaseService
      let args: ICard
      let model: ICardHistory
      let modelSubject: Subject<ICardHistory>
      let epic: CardHistoryEpic

      beforeEach(() => {
        actions = new CardHistoryActions()
        databaseServiceMock = mock(DatabaseServiceImplementation)
        args = {
          uid: 'myUid',
          deckId: 'myDeckId',
          cardId: 'myCardId',
        }
        model = {
          ...args,
          difficulty: 0,
          grade: 0,
          repetitions: 0,
          previousReview: 0,
          nextReview: 0,
        }
        modelSubject = new Subject<ICardHistory>()
        when(databaseServiceMock.getCardHistory(deepEqual(args)))
          .thenReturn(modelSubject)

        epic = new CardHistoryEpic(
          actions,
          instance(logServiceMock),
          instance(databaseServiceMock),
        )
      })

      it('selects correct substore', () => {
        const store: IStore<IState> = configureMockStore(epic.epic, createMockState({
          cardHistory: Map<string, any>({
            'myCardId': Map<string, any>({
              isListening: true,
            })
          })
        }))

        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
        ])
      })

      it('fetches model from database service', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, model),
        ])
      })
    })

    describe('deck-info', () => {
      let actions: DeckInfoActions
      let databaseServiceMock: DatabaseService
      let args: IDeck
      let model: IDeckInfo
      let modelSubject: Subject<IDeckInfo>
      let epic: DeckInfoEpic

      beforeEach(() => {
        actions = new DeckInfoActions()
        databaseServiceMock = mock(DatabaseServiceImplementation)
        args = {
          uid: 'myUid',
          deckId: 'myDeckId',
        }
        model = {
          ...args,
          name: 'myName',
          description: 'myDescription',
        }
        modelSubject = new Subject<IDeckInfo>()
        when(databaseServiceMock.getDeckInfo(deepEqual(args)))
          .thenReturn(modelSubject)

        epic = new DeckInfoEpic(
          actions,
          instance(logServiceMock),
          instance(databaseServiceMock),
        )
      })

      it('selects correct substore', () => {
        const store: IStore<IState> = configureMockStore(epic.epic, createMockState({
          deckInfo: Map<string, any>({
            'myDeckId': Map<string, any>({
              isListening: true,
            })
          })
        }))

        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
        ])
      })

      it('fetches model from database service', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, model),
        ])
      })
    })

    describe('card', () => {
      let actions: CardActions
      let cardContentActions: CardContentActions
      let cardHistoryActions: CardHistoryActions
      let databaseServiceMock: DatabaseService
      let args: IDeck
      let model: ICard[]
      let modelSubject: Subject<ICard[]>
      let epic: CardEpic

      beforeEach(() => {
        actions = new CardActions()
        cardContentActions = new CardContentActions()
        cardHistoryActions = new CardHistoryActions()
        databaseServiceMock = mock(DatabaseServiceImplementation)
        args = {
          uid: 'myUid',
          deckId: 'myDeckId',
        }
        model = [{
          ...args,
          cardId: 'myCardId',
        }]
        modelSubject = new Subject<ICard[]>()
        when(databaseServiceMock.getCards(deepEqual(args)))
          .thenReturn(modelSubject)

        epic = new CardEpic(
          actions,
          cardContentActions,
          cardHistoryActions,
          instance(logServiceMock),
          instance(databaseServiceMock),
        )
      })

      it('selects correct substore', () => {
        const store: IStore<IState> = configureMockStore(epic.epic, createMockState({
          card: Map<string, any>({
            'myDeckId': Map<string, any>({
              isListening: true,
            })
          })
        }))

        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
        ])
      })

      it('fetches models from database service', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.listReceived(args, model),
        ])
      })

      it('dispatches STOP_LISTENING actions for CARD_CONTENT and CARD_HISTORY', () => {
        const store: IStore<IState> = configureMockStore(epic.stopListeningEpic, createMockState({
          card: Map<string, any>({
            'myDeckId': Map<string, any>({
              isListening: true,
              data: Map<string, ICard>({
                ['myCardId']: model[0],
              })
            })
          })
        }))

        store.dispatch(actions.beforeStopListening(args))

        expectEqual(errorMessages, [])

        const cardArgs: ICard = {
          ...args,
          cardId: 'myCardId',
        }
        expectEqual(store.getActions(), [
          actions.beforeStopListening(args),
          actions.stopListening(args),
          cardContentActions.stopListening(cardArgs),
          cardHistoryActions.stopListening(cardArgs),
        ])
      })
    })

    describe('deck', () => {
      let actions: DeckActions
      let deckInfoActions: DeckInfoActions
      let cardActions: CardActions
      let databaseServiceMock: DatabaseService
      let args: IUser
      let model: IDeck[]
      let modelSubject: Subject<IDeck[]>
      let epic: DeckEpic

      beforeEach(() => {
        actions = new DeckActions()
        deckInfoActions = new DeckInfoActions()
        cardActions = new CardActions()
        databaseServiceMock = mock(DatabaseServiceImplementation)
        args = {
          uid: 'myUid',
        }
        model = [{
          ...args,
          deckId: 'myDeckId',
        }]
        modelSubject = new Subject<IDeck[]>()
        when(databaseServiceMock.getDecks(deepEqual(args)))
          .thenReturn(modelSubject)

        epic = new DeckEpic(
          actions,
          cardActions,
          deckInfoActions,
          instance(logServiceMock),
          instance(databaseServiceMock),
        )
      })

      it('selects correct substore', () => {
        const store: IStore<IState> = configureMockStore(epic.epic, createMockState({
          deck: Map<string, any>({
            isListening: true,
          })
        }))

        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
        ])
      })

      it('fetches models from database service', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.listReceived(args, model),
        ])
      })

      it('dispatches BEFORE_STOP_LISTENING for CARD and STOP_LISTENING for DECK_INFO', () => {
        const store: IStore<IState> = configureMockStore(epic.stopListeningEpic, createMockState({
          deck: Map<string, any>({
            isListening: true,
            data: Map<string, IDeck>({
              ['myDeckId']: model[0],
            })
          })
        }))

        store.dispatch(actions.beforeStopListening(args))

        expectEqual(errorMessages, [])

        const deckArgs: IDeck = {
          ...args,
          deckId: 'myDeckId',
        }
        expectEqual(store.getActions(), [
          actions.beforeStopListening(args),
          actions.stopListening(args),
          cardActions.beforeStopListening(deckArgs),
          deckInfoActions.stopListening(deckArgs),
        ])
      })
    })

    describe('user', () => {
      let actions: UserActions
      let deckActions: DeckActions
      let authShimServiceMock: AuthShimService
      let args: {}
      let model: IUser
      let modelSubject: Subject<IUser>
      let epic: UserEpic

      beforeEach(() => {
        actions = new UserActions()
        deckActions = new DeckActions()
        authShimServiceMock = mock(AuthShimServiceImplementation)
        args = {}
        model = {
          uid: 'myUid',
        }
        modelSubject = new Subject<IUser>()
        when(authShimServiceMock.getUser()).thenReturn(modelSubject)

        epic = new UserEpic(
          actions,
          deckActions,
          instance(logServiceMock),
          instance(authShimServiceMock),
        )
      })

      it('selects correct substore', () => {
        const store: IStore<IState> = configureMockStore(epic.epic, createMockState({
          user: Map<string, any>({
            isListening: true,
          })
        }))

        store.dispatch(actions.beforeStartListening(args))

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
        ])
      })

      it('fetches model from firebase auth service', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)
        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, model),
          deckActions.beforeStartListening(model),
        ])
      })

      it('dispatches DECK_BEFORE_STOP_LISTENING action for previous user if not null', () => {
        const store: IStore<IState> = configureMockStore(epic.epic, createMockState({
          user: Map<string, any>({
            data: Map<string, any>({
              uid: 'myOldUid',
            })
          })
        }))

        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          deckActions.beforeStopListening({ uid: 'myOldUid' }),
          actions.objectReceived(args, model),
          deckActions.beforeStartListening(model),
        ])
      })

      it('does not dispatch DECK_BEFORE_STOP_LISTENING action for previous user if null', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)

        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, model),
          deckActions.beforeStartListening(model),
        ])
      })

      it('dispatches USER_OBJECT_RECEIVED and DECK_BEFORE_START_LISTENING for new user if not null', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)

        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(model)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, model),
          deckActions.beforeStartListening(model),
        ])
      })

      it('dispatches USER_OBJECT_RECEIVED but not DECK_BEFORE_START_LISTENING for new user if null', () => {
        const store: IStore<IState> = configureMockStore(epic.epic)

        store.dispatch(actions.beforeStartListening(args))
        modelSubject.next(null)

        expectEqual(errorMessages, [])
        expectEqual(store.getActions(), [
          actions.beforeStartListening(args),
          actions.startListening(args),
          actions.objectReceived(args, null),
        ])
      })
    })
  })
})