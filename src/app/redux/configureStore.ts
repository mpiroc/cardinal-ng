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
import { GradingService } from '../services/grading.service';
import { LogService } from '../services/log.service';

import {
  rootReducer,
  createRootEpic,
} from './root';
import { IState } from './state';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function logAction(logService: LogService, prefix: string, action: Action): Action {
  logService.debug(prefix + action.type);
  return action;
}

export function configureStore(
  ngRedux: NgRedux<IState>,
  authService: AuthService,
  databaseService: DatabaseService,
  gradingService: GradingService,
  logService: LogService) {
  const options: Options = {
    adapter: {
      input: (action$: Observable<Action>) => action$.map(action => logAction(logService, "INPUT: ", action)),
      output: (action$: Observable<Action>) => action$.map(action => logAction(logService, "OUTPUT: ", action)),
    }
  }

  const rootEpic = createRootEpic(ngRedux, authService, databaseService, gradingService, logService);
  const epicMiddleware = createEpicMiddleware(rootEpic, options);

  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );
}