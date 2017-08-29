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

export interface IDeck {
  uid: string;
  deckId: string,
}

export interface IDeckInfo extends IDeck {
  name: string;
  description: string;
}

export interface ICard {
  uid: string;
  deckId: string;
  cardId: string,
}

export interface ICardContent extends ICard {
  front: string;
  back: string;
}

export interface ICardHistory extends ICard {
  difficulty: number;
  grade: number;
  repetitions: number;
  previousReview: number;
  nextReview: number;
}
