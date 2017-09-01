import { Action } from 'redux';

export const EDIT_DECK_SET_NAME = "EDIT_DECK_SET_NAME";
export const EDIT_DECK_SET_DESCRIPTION = "EDIT_DECK_SET_DESCRIPTION";

export interface IEditDeckSetNameAction extends Action {
  name: string;
}

export interface IEditDeckSetDescriptionAction extends Action {
  description: string;
}

export function editDeckSetName(name: string) : IEditDeckSetNameAction {
  return {
    type: EDIT_DECK_SET_NAME,
    name,
  }
}

export function editDeckSetDescription(description: string) : IEditDeckSetDescriptionAction {
  return {
    type: EDIT_DECK_SET_DESCRIPTION,
    description,
  }
}
