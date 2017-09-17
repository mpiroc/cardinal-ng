import { Map } from 'immutable'
import {
  FirebaseObjectReducer,
  FirebaseMapReducer,
  FirebaseListReducer,
  CardContentObjectReducer,
  CardContentMapReducer,
  CardHistoryObjectReducer,
  CardHistoryMapReducer,
  CardListReducer,
  CardMapReducer,
  DeckInfoObjectReducer,
  DeckInfoMapReducer,
} from '../firebase'
import {
  FirebaseActions,
  CardContentActions,
  CardHistoryActions,
  CardActions,
  DeckInfoActions,
} from '../../actions/firebase'

interface IArgs {
  id: string
}

interface IModel extends IArgs {
  content: string
}

class TestActions extends FirebaseActions<IModel, IArgs> {
  constructor() {
    super('TEST')
  }
}

class TestObjectReducer extends FirebaseObjectReducer<IModel, IArgs> {
  constructor(actions: TestActions) {
    super(actions)
  }
}

class TestMapReducer extends FirebaseMapReducer<IModel, IArgs> {
  constructor(actions: TestActions, objectReducer: TestObjectReducer) {
    super(actions, objectReducer)
  }

  selectKey(args: IArgs) {
    return args.id
  }
}

class TestListReducer extends FirebaseListReducer<IModel, IArgs> {
  constructor(actions: TestActions) {
    super(actions)
  }

  selectKey(args: IArgs) {
    return args.id
  }
}

describe('reducers', () => {
  describe('firebaseObject', () => {
    let actions: TestActions
    let reducer: TestObjectReducer
    let beforeState: Map<string, any>
    let afterState: Map<string, any>
    let args: IArgs

    beforeEach(() => {
      actions = new TestActions()
      reducer = new TestObjectReducer(actions)
      args = { id: 'myId' }
    })

    afterEach(() => {
      actions = undefined
      reducer = undefined
      beforeState = undefined
      afterState = undefined
      args = undefined
    })

    describe('initialState', () => {
      it('should initialize all properties', () => {
        const state = reducer.reducer(undefined, { type: '@@TEST' })

        expect(state).toBeTruthy()
        expect(state.size).toEqual(4)
        expect(state.get('isListening')).toEqual(false)
        expect(state.get('isLoading')).toEqual(true)
        expect(state.get('error')).toBeNull()
        expect(state.get('data')).toBeNull()
      })
    })
    describe('startListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isListening: false,
          isLoading: false,
          error: 'myError',
        })
        afterState = reducer.reducer(beforeState, actions.startListening(args))
      })

      it('should mark state as listening', () => {
        expect(beforeState.get('isListening')).toEqual(false)
        expect(afterState.get('isListening')).toEqual(true)
      })
      it('should mark state as loading', () => {
        expect(beforeState.get('isLoading')).toEqual(false)
        expect(afterState.get('isLoading')).toEqual(true)
      })
      it('should clear any previous error', () => {
        expect(beforeState.get('error')).toBeTruthy()
        expect(afterState.get('error')).toBeNull()
      })
    })
    describe('stopListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isListening: true,
          isLoading: true,
          error: 'myError',
        })
        afterState = reducer.reducer(beforeState, actions.stopListening(args))
      })

      it('should mark state as not listening', () => {
        expect(beforeState.get('isListening')).toEqual(true)
        expect(afterState.get('isListening')).toEqual(false)
      })
      it('should mark state as not loading', () => {
        expect(beforeState.get('isLoading')).toEqual(true)
        expect(afterState.get('isLoading')).toEqual(false)
      })
      it('should clear any previous error', () => {
        expect(beforeState.get('error')).toBeTruthy()
        expect(afterState.get('error')).toBeNull()
      })
    })
    describe('received', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isLoading: true,
          error: 'myError',
          data: null,
        })
        afterState = reducer.reducer(beforeState, actions.objectReceived(args, {
          ...args,
          content: 'myContent',
        }))
      })

      it('should mark state as not loading', () => {
        expect(beforeState.get('isLoading')).toEqual(true)
        expect(afterState.get('isLoading')).toEqual(false)
      })
      it('should clear any previous error', () => {
        expect(beforeState.get('error')).toBeTruthy()
        expect(afterState.get('error')).toBeNull()
      })
      it('should convert data to immutable map and store in state', () => {
        expect(beforeState.get('data')).toBeNull()
        expect(afterState.get('data')).toBeTruthy()
        expect(afterState.get('data').get('content')).toEqual('myContent')
      })
    })
    describe('setIsLoading', () => {
      it('should set isLoading in state', () => {
        beforeState = Map<string, any>({
          isLoading: false,
        })

        afterState = reducer.reducer(beforeState, actions.setIsLoading(args, true))
        expect(afterState.get('isLoading')).toEqual(true)
        afterState = reducer.reducer(afterState, actions.setIsLoading(args, false))
        expect(afterState.get('isLoading')).toEqual(false)
      })
    })
    describe('error', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isListening: true,
          isLoading: true,
          error: null,
        })
        afterState = reducer.reducer(beforeState, actions.error(args, 'myError'))
      })
      it('should mark state as not listening', () => {
        expect(beforeState.get('isListening')).toEqual(true)
        expect(afterState.get('isListening')).toEqual(false)
      })
      it('should mark state as not loading', () => {
        expect(beforeState.get('isLoading')).toEqual(true)
        expect(afterState.get('isLoading')).toEqual(false)
      })
      it('should store error message in state', () => {
        expect(beforeState.get('error')).toBeNull()
        expect(afterState.get('error')).toEqual('myError')
      })
    })
  })
  describe('firebaseMap', () => {
    let actions: TestActions
    let reducer: TestMapReducer
    let beforeState: Map<string, any>
    let afterState: Map<string, any>
    let args: IArgs

    beforeEach(() => {
      actions = new TestActions()
      const objectReducer = new TestObjectReducer(actions)
      reducer = new TestMapReducer(actions, objectReducer)
      args = { id: 'myId' }
    })

    afterEach(() => {
      actions = undefined
      reducer = undefined
      beforeState = undefined
      afterState = undefined
      args = undefined
    })

    describe('initialState', () => {
      it('should initialize all properties', () => {
        const state = reducer.reducer(undefined, { type: '@@TEST' })

        expect(state).toBeTruthy()
        expect(state.size).toEqual(0)
      })
    })
    describe('beforeStartListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>()
        afterState = reducer.reducer(beforeState,
          actions.beforeStartListening(args))
      })
      it('should not set state at the root level', () => {
        expect(beforeState.size).toEqual(0)
        expect(afterState.size).toEqual(1)
      })
      it('should set child state', () => {
        expect(beforeState.get('myId')).toBeUndefined()
        expect(afterState.get('myId')).toBeTruthy()
      })
    })
    describe('startListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>()
        afterState = reducer.reducer(beforeState,
          actions.startListening(args))
      })
      it('should not set state at the root level', () => {
        expect(beforeState.size).toEqual(0)
        expect(afterState.size).toEqual(1)
      })
      it('should set child state', () => {
        expect(beforeState.get('myId')).toBeUndefined()
        expect(afterState.get('myId')).toBeTruthy()
      })
    })
    describe('beforeStopListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>()
        afterState = reducer.reducer(beforeState,
          actions.startListening(args))
      })
      it('should not set state at the root level', () => {
        expect(beforeState.size).toEqual(0)
        expect(afterState.size).toEqual(1)
      })
      it('should set child state', () => {
        expect(beforeState.get('myId')).toBeUndefined()
        expect(afterState.get('myId')).toBeTruthy()
      })
    })
    describe('stopListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          myId: Map({
            ...args,
            content: 'myContent',
          })
        })
        afterState = reducer.reducer(beforeState,
          actions.stopListening(args))
      })
      it('should not set state at the root level', () => {
        expect(beforeState.size).toEqual(1)
        expect(afterState.size).toEqual(0)
      })
      it('should remove child state', () => {
        expect(beforeState.get('myId')).toBeTruthy()
        expect(afterState.get('myId')).toBeUndefined()
      })
    })
    describe('received', () => {
      beforeEach(() => {
        beforeState = Map<string, any>()
        const model = {
          ...args,
          content: 'myContent',
        }
        afterState = reducer.reducer(beforeState, actions.objectReceived(args, model))
      })
      it('should not set state at the root level', () => {
        expect(beforeState.size).toEqual(0)
        expect(afterState.size).toEqual(1)
      })
      it('should set child state', () => {
        expect(beforeState.get('myId')).toBeUndefined()
        expect(afterState.get('myId')).toBeTruthy()
      })
    })
    describe('setIsLoading', () => {
      beforeEach(() => {
        beforeState = Map<string, any>()
        afterState = reducer.reducer(beforeState,
          actions.setIsLoading(args, true))
      })
      it('should not set state at the root level', () => {
        expect(beforeState.size).toEqual(0)
        expect(afterState.size).toEqual(1)
      })
      it('should set child state', () => {
        expect(beforeState.get('myId')).toBeUndefined()
        expect(afterState.get('myId')).toBeTruthy()
      })
    })
    describe('error', () => {
      beforeEach(() => {
        beforeState = Map<string, any>()
        afterState = reducer.reducer(beforeState,
          actions.error(args, 'myError'))
      })
      it('should not set state at the root level', () => {
        expect(beforeState.size).toEqual(0)
        expect(afterState.size).toEqual(1)
      })
      it('should set child state', () => {
        expect(beforeState.get('myId')).toBeUndefined()
        expect(afterState.get('myId')).toBeTruthy()
      })
    })
  })
  describe('firebaseList', () => {
    let actions: TestActions
    let reducer: TestListReducer
    let beforeState: Map<string, any>
    let afterState: Map<string, any>
    let args: IArgs

    beforeEach(() => {
      actions = new TestActions()
      reducer = new TestListReducer(actions)
      args = { id: 'myId' }
    })

    afterEach(() => {
      actions = undefined
      reducer = undefined
      beforeState = undefined
      afterState = undefined
      args = undefined
    })

    describe('initialState', () => {
      it('should initialize all properties', () => {
        const state = reducer.reducer(undefined, { type: '@@TEST' })

        expect(state).toBeTruthy()
        expect(state.size).toEqual(4)
        expect(state.get('isListening')).toEqual(false)
        expect(state.get('isLoading')).toEqual(true)
        expect(state.get('error')).toBeNull()
        expect(state.get('data')).toBeTruthy()
        expect(state.get('data').size).toEqual(0)
      })
    })
    describe('startListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isListening: false,
          isLoading: false,
          error: 'myError',
        })
        afterState = reducer.reducer(beforeState, actions.startListening(args))
      })

      it('should mark state as listening', () => {
        expect(beforeState.get('isListening')).toEqual(false)
        expect(afterState.get('isListening')).toEqual(true)
      })
      it('should mark state as loading', () => {
        expect(beforeState.get('isLoading')).toEqual(false)
        expect(afterState.get('isLoading')).toEqual(true)
      })
      it('should clear any previous error', () => {
        expect(beforeState.get('error')).toBeTruthy()
        expect(afterState.get('error')).toBeNull()
      })
    })
    describe('stopListening', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isListening: true,
          isLoading: true,
          error: 'myError',
          data: Map<string, IModel>({
            myId: { ...args, content: 'myContent' }
          })
        })
        afterState = reducer.reducer(beforeState, actions.stopListening(args))
      })

      it('should mark state as not listening', () => {
        expect(beforeState.get('isListening')).toEqual(true)
        expect(afterState.get('isListening')).toEqual(false)
      })
      it('should mark state as not loading', () => {
        expect(beforeState.get('isLoading')).toEqual(true)
        expect(afterState.get('isLoading')).toEqual(false)
      })
      it('should clear any previous error', () => {
        expect(beforeState.get('error')).toBeTruthy()
        expect(afterState.get('error')).toBeNull()
      })
      it('should remove all child objects from state', () => {
        expect(beforeState.get('data').size).toEqual(1)
        expect(afterState.get('data').size).toEqual(0)
      })
    })
    describe('received', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isLoading: true,
          error: 'myError',
          data: Map<string, IModel>(),
        })
        afterState = reducer.reducer(beforeState, actions.listReceived(args, [
          {
            ...args,
            content: 'myContent',
          }
        ]))
      })

      it('should mark state as not loading', () => {
        expect(beforeState.get('isLoading')).toEqual(true)
        expect(afterState.get('isLoading')).toEqual(false)
      })
      it('should clear any previous error', () => {
        expect(beforeState.get('error')).toBeTruthy()
        expect(afterState.get('error')).toBeNull()
      })
      it('should map objects from their keys and store in state', () => {
        expect(beforeState.get('data').size).toEqual(0)
        expect(afterState.get('data').size).toEqual(1)
        expect(afterState.get('data').get('myId')).toEqual({
          ...args,
          content: 'myContent',
        })
      })
    })
    describe('setIsLoading', () => {
      it('should set isLoading in state', () => {
        beforeState = Map<string, any>({
          isLoading: false,
        })

        afterState = reducer.reducer(beforeState, actions.setIsLoading(args, true))
        expect(afterState.get('isLoading')).toEqual(true)
        afterState = reducer.reducer(afterState, actions.setIsLoading(args, false))
        expect(afterState.get('isLoading')).toEqual(false)
      })
    })
    describe('error', () => {
      beforeEach(() => {
        beforeState = Map<string, any>({
          isListening: true,
          isLoading: true,
          error: null,
        })
        afterState = reducer.reducer(beforeState, actions.error(args, 'myError'))
      })
      it('should mark state as not listening', () => {
        expect(beforeState.get('isListening')).toEqual(true)
        expect(afterState.get('isListening')).toEqual(false)
      })
      it('should mark state as not loading', () => {
        expect(beforeState.get('isLoading')).toEqual(true)
        expect(afterState.get('isLoading')).toEqual(false)
      })
      it('should store error message in state', () => {
        expect(beforeState.get('error')).toBeNull()
        expect(afterState.get('error')).toEqual('myError')
      })
    })
  })
  describe('cardContentMap', () => {
    describe('selectKey', () => {
      it('should select correct key', () => {
        const actions = new CardContentActions()
        const reducer = new CardContentMapReducer(
          actions,
          new CardContentObjectReducer(actions),
        )

        const key = reducer.selectKey({
          uid: 'myUid',
          deckId: 'myDeckId',
          cardId: 'myCardId',
        })

        expect(key).toEqual('myCardId')
      })
    })
  })
  describe('cardHistoryMap', () => {
    describe('selectKey', () => {
      it('should select correct key', () => {
        const actions = new CardHistoryActions()
        const reducer = new CardHistoryMapReducer(
          actions,
          new CardHistoryObjectReducer(actions),
        )

        const key = reducer.selectKey({
          uid: 'myUid',
          deckId: 'myDeckId',
          cardId: 'myCardId',
        })

        expect(key).toEqual('myCardId')
      })
    })
  })
  describe('cardMap', () => {
    describe('selectKey', () => {
      it('should select correct key', () => {
        const actions = new CardActions()
        const reducer = new CardMapReducer(
          actions,
          new CardListReducer(actions),
        )

        const key = reducer.selectKey({
          uid: 'myUid',
          deckId: 'myDeckId',
        })

        expect(key).toEqual('myDeckId')
      })
    })
  })
  describe('deckInfoMap', () => {
    describe('selectKey', () => {
      it('should select correct key', () => {
        const actions = new DeckInfoActions()
        const reducer = new DeckInfoMapReducer(
          actions,
          new DeckInfoObjectReducer(actions),
        )

        const key = reducer.selectKey({
          uid: 'myUid',
          deckId: 'myDeckId',
        })

        expect(key).toEqual('myDeckId')
      })
    })
  })
})
