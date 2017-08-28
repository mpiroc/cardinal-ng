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