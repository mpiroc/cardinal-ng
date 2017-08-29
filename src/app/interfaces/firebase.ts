// Models
export interface IUser {
  uid: string;
}

export interface IDeck extends IUser {
  deckId: string;
}

export interface IDeckInfo extends IDeck {
  name: string;
  description: string;
}

export interface ICard extends IDeck {
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
