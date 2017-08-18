import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createRootEpic } from './epics/root';
import { rootReducer } from './reducers/root';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { compose } from 'redux';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore(authService: AuthService, databaseService: DatabaseService) {
  const rootEpic = createRootEpic(authService, databaseService);
  const epicMiddleware = createEpicMiddleware(rootEpic);

  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );
}