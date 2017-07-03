export interface ICardContent {
  side1: string;
  side2: string;
}

export interface ICardHistory {
  difficulty: number;
  grade: number;
  repetitionCount: number;
}

export interface IDeckCard {
  uid: string;
  deckId: string;
  cardId: string;
}

export interface IUserDeck {
  uid: string;
  deckId: string;
  name: string;
  description: string;
}

export interface IUser {
  uid: string;
  name: string;
}