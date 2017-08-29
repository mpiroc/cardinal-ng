// Args
export interface IUserArgs {
  uid: string;
}

export interface IDeckArgs extends IUserArgs {
  deckId: string;
}

export interface ICardArgs extends IDeckArgs {
  cardId: string;
}

// Models
export interface IUser extends firebase.UserInfo {
}

export interface IUserDeck {
  uid: string;
  deckId: string,
}

export interface IDeckInfo extends IUserDeck {
  name: string;
  description: string;
}

export interface IDeckCard {
  uid: string;
  deckId: string;
  cardId: string,
}

export interface ICardContent extends IDeckCard {
  front: string;
  back: string;
}

export interface ICardHistory extends IDeckCard {
  difficulty: number;
  grade: number;
  repetitions: number;
  previousReview: number;
  nextReview: number;
}
