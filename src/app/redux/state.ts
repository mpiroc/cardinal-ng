import { Map } from 'immutable';

export interface IState {
  user: Map<string, any>;
  deck: Map<string, any>;
  deckInfo: Map<string, any>;
  card: Map<string, any>;
  editCard: Map<string, any>;
  editDeck: Map<string, any>;
  signIn: Map<string, any>;
  signUp: Map<string, any>;
  cardContent: Map<string, any>;
  cardHistory: Map<string, any>;
  review: Map<string, any>;
}
