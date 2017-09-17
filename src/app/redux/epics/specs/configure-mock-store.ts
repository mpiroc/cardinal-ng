import { Action } from 'redux'
import {
  Epic,
  createEpicMiddleware,
} from 'redux-observable'
import createMockStore, {
  mockStore,
  IStore,
} from 'redux-mock-store'
import { Map } from 'immutable'
import { IState } from '../../state'

export function createMockState(overrides: any = null): IState {
  return {
    user: Map<string, any>(),
    deck: Map<string, any>(),
    deckInfo: Map<string, any>(),
    card: Map<string, any>(),
    editCard: Map<string, any>(),
    editDeck: Map<string, any>(),
    signIn: Map<string, any>(),
    signUp: Map<string, any>(),
    resetPassword: Map<string, any>(),
    cardContent: Map<string, any>(),
    cardHistory: Map<string, any>(),
    review: Map<string, any>(),
    ...(overrides || {}),
  }
}

export function configureMockStore(epic: Epic<Action, IState>, state: IState = null): IStore<IState> {
  const middlewares = [createEpicMiddleware(epic)]
  const _mockStore: mockStore<IState> = createMockStore<IState>(middlewares)

  state = state || createMockState()
  const store: IStore<IState> = _mockStore(state)

  return store
}
