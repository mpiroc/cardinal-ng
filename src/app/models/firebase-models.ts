export interface IUserDeck {
  uid: string;
  $key: string;
}

export interface IDeckInfo extends IUserDeck {
  name: string;
  description: string;
}

export interface IDeckCard {
  uid: string;
  deckId: string;
  $key: string;
}

export interface ICardContent extends IDeckCard {
  front: string;
  back: string;
}

export interface ICardHistory extends IDeckCard {
  difficulty: number;
  grade: number;
  repetitions: number;
}
