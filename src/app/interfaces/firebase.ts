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
export interface IFirebaseModel {
  $key: string;
}

export interface IUser extends IFirebaseModel, firebase.UserInfo {
}

export interface IUserDeck extends IFirebaseModel {
  uid: string;
}

export interface IDeckInfo extends IUserDeck {
  name: string;
  description: string;
}

export interface IDeckCard extends IFirebaseModel {
  uid: string;
  deckId: string;
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
