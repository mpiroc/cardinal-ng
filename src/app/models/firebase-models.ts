export interface IUser {
  uid: string;
  name: string;
}

export interface IUserDeck {
  uid: string;
  deckId: string;
}

export interface IDeckInfo {
  uid: string;
  deckId: string;
  name: string;
  description: string;
}

export interface IDeckCard {
  uid: string,
  deckId: string,
  cardId: string,
}

export interface ICardContent {
  uid: string,
  deckId: string,
  cardId: string,
  front: string;
  back: string;
}

export interface ICardHistory {
  uid: string,
  deckId: string,
  cardId: string,
  difficulty: number;
  grade: number;
  repetitionCount: number;
}
