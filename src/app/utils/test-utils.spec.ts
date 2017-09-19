import {
  NgRedux,
  Selector,
  Comparator,
  PathSelector,
  ObservableStore,
} from '@angular-redux/store'
import {
  Action,
  MiddlewareAPI,
  Reducer,
  Middleware,
  StoreEnhancer,
  Store,
  Dispatch,
  Unsubscribe,
} from 'redux'
import {
  Epic,
  createEpicMiddleware,
} from 'redux-observable'
import createMockStore, {
  mockStore,
  IStore,
} from 'redux-mock-store'
import { Map } from 'immutable'
import { Observable } from 'rxjs/Observable'

import { GradingService } from '../services/grading.service'
import { LogService } from '../services/log.service'
import { ICardHistory } from '../interfaces/firebase'
import { IState } from '../redux/state'

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

export function configureMockStore(epic?: Epic<Action, IState>, state?: IState): IStore<IState> {
  const emptyEpic = (action$, store) => Observable.of()
  const middlewares = [
    epic ?
      createEpicMiddleware(epic) :
      createEpicMiddleware(emptyEpic)
  ]
  const _mockStore: mockStore<IState> = createMockStore<IState>(middlewares)

  state = state || createMockState()
  const store: IStore<IState> = _mockStore(state)

  return store
}

export function expectEqual<T>(actual: T[], expected: T[]) {
  expect(actual.length).toEqual(expected.length)

  const maxLength = Math.max(actual.length, expected.length)
  for (let i = 0; i < maxLength; i++) {
    expect(actual[i]).toEqual(expected[i])
  }
}

export class NgReduxExtension extends NgRedux<IState> {
  configureStore: (rootReducer: Reducer<IState>, initState: IState, middleware?: Middleware[], enhancers?: StoreEnhancer<IState>[]) => void =
    (rootReducer, initState, middleware, enhancers) => {}
  provideStore: (store: Store<IState>) => void = store => {}
  dispatch: Dispatch<IState> = action => action
  getState: () => IState = () => null

  subscribe: (listener: () => void) => Unsubscribe = listener => null
  replaceReducer: (nextReducer: Reducer<IState>) => void = nextReducer => null
  select: <SelectedType>(selector?: Selector<IState, SelectedType>, comparator?: Comparator) => Observable<SelectedType> =
    (selector, comparator) => null
  configureSubStore: <SubState>(basePath: PathSelector, localReducer: Reducer<SubState>) => ObservableStore<SubState> =
    (basePath, localReducer) => null
}
