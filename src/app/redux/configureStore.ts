import { Observable } from 'rxjs/Observable';
import { NgRedux } from '@angular-redux/store';
import {
  createStore,
  applyMiddleware,
  compose,
  Action,
} from 'redux';
import {
  createEpicMiddleware,
  Options,
} from 'redux-observable';

import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { ErrorService } from '../services/error.service';
import { GradingService } from '../services/grading.service';

import {
  rootReducer,
  createRootEpic,
} from './root';
import { IState } from './state';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function logAction(prefix: string, action: Action): Action {
  console.debug(prefix + action.type);
  return action;
}

export function configureStore(
  ngRedux: NgRedux<IState>,
  authService: AuthService,
  databaseService: DatabaseService,
  errorService: ErrorService,
  gradingService: GradingService) {
  const options: Options = {
    adapter: {
      input: (action$: Observable<Action>) => action$.map(action => logAction("INPUT: ", action)),
      output: (action$: Observable<Action>) => action$.map(action => logAction("OUTPUT: ", action)),
    }
  }

  const rootEpic = createRootEpic(ngRedux, authService, databaseService, errorService, gradingService);
  const epicMiddleware = createEpicMiddleware(rootEpic, options);

  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );
}