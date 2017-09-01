import { Action } from 'redux';

export const EDIT_CARD_SET_FRONT = "EDIT_CARD_SET_FRONT";
export const EDIT_CARD_SET_BACK = "EDIT_CARD_SET_BACK";

export interface IEditCardSetFrontAction extends Action {
  front: string;
}

export interface IEditCardSetBackAction extends Action {
  back: string;
}

export function editCardSetFront(front: string) : IEditCardSetFrontAction {
  return {
    type: EDIT_CARD_SET_FRONT,
    front,
  }
}

export function editCardSetBack(back: string) : IEditCardSetBackAction {
  return {
    type: EDIT_CARD_SET_BACK,
    back,
  }
}
