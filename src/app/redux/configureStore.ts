import { Observable } from 'rxjs/Observable';
import { createStore, applyMiddleware, compose, Action } from 'redux';
import { createEpicMiddleware, Options } from 'redux-observable';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  rootReducer,
  createRootEpic,
} from './root';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function logAction(prefix: string, action: Action): Action {
  console.debug(prefix + action.type);
  return action;
}

export function configureStore(authService: AuthService, databaseService: DatabaseService) {
  const options: Options = {
    adapter: {
      input: (action$: Observable<Action>) => action$.map(action => logAction("INPUT: ", action)),
      output: (action$: Observable<Action>) => action$.map(action => logAction("OUTPUT: ", action)),
    }
  }

  const rootEpic = createRootEpic(authService, databaseService);
  const epicMiddleware = createEpicMiddleware(rootEpic, options);

  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );
}