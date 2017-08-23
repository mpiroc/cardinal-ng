export interface IState {
  user: Map<string, any>;
  userDecks: Map<string, any>;
  deckInfos: Map<string, any>;
  deckCards: Map<string, any>;
  cardContent: Map<string, any>;
  cardHistory: Map<string, any>;
}

export function isListening(store: Map<string, any>, ...path: string[]) {
  const result = path.reduce((current, key) => {
    return current ? null : current.get(key);
  }, store);

  return result ? result.get("isListening") === true : false;
}