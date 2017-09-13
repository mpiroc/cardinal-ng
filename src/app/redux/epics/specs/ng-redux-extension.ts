import { Observable } from 'rxjs/Observable';
import {
  Action,
  MiddlewareAPI,
  Reducer,
  Middleware,
  StoreEnhancer,
  Store,
  Dispatch,
  Unsubscribe,
} from 'redux';
import {
  NgRedux,
  Selector,
  Comparator,
  PathSelector,
  ObservableStore,
} from '@angular-redux/store';

import { GradingService } from '../../../services/grading.service';
import { LogService } from '../../../services/log.service';
import { ICardHistory } from '../../../interfaces/firebase';
import { IState } from '../../state';

export class NgReduxExtension extends NgRedux<IState> {
  configureStore: (rootReducer: Reducer<IState>, initState: IState, middleware?: Middleware[], enhancers?: StoreEnhancer<IState>[]) => void =
    (rootReducer, initState, middleware, enhancers) => {};
  provideStore: (store: Store<IState>) => void = store => {};
  dispatch: Dispatch<IState> = action => action;
  getState: () => IState = () => null;

  subscribe: (listener: () => void) => Unsubscribe = listener => null;
  replaceReducer: (nextReducer: Reducer<IState>) => void = nextReducer => null;
  select: <SelectedType>(selector?: Selector<IState, SelectedType>, comparator?: Comparator) => Observable<SelectedType> =
    (selector, comparator) => null;
  configureSubStore: <SubState>(basePath: PathSelector, localReducer: Reducer<SubState>) => ObservableStore<SubState> =
    (basePath, localReducer) => null;
}