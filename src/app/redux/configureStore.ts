import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import {
  rootReducer,
  createRootEpic,
} from './root';


const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore(authService: AuthService, databaseService: DatabaseService) {
  const rootEpic = createRootEpic(authService, databaseService);
  const epicMiddleware = createEpicMiddleware(rootEpic);

  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );
}