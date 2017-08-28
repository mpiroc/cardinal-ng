import { Map } from 'immutable';

export interface IState {
  user: Map<string, any>;
  userDeck: Map<string, any>;
  deckInfo: Map<string, any>;
  deckCard: Map<string, any>;
  cardContent: Map<string, any>;
  cardHistory: Map<string, any>;
  review: Map<string, any>;
}

export function isListening(store: Map<string, any>, ...path: string[]) {
  const result = path.reduce((current, key) => {
    return current ? current.get(key) : null;
  }, store);

  return result ? result.get("isListening") === true : false;
}