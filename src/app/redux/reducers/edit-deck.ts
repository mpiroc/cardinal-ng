import { Map } from 'immutable';
import { Action } from 'redux';

import {
  EDIT_DECK_SET_NAME,
  EDIT_DECK_SET_DESCRIPTION,
  IEditDeckSetNameAction,
  IEditDeckSetDescriptionAction,
} from '../actions/edit-deck';

const initialState = Map<string, any>({
  name: null,
  description: null,
})

export function editDeck(state: Map<string, any> = initialState, action: Action) {
  switch(action.type) {
    case EDIT_DECK_SET_NAME:
      return state.set("name", (action as IEditDeckSetNameAction).name);

    case EDIT_DECK_SET_DESCRIPTION:
      return state.set("description", (action as IEditDeckSetDescriptionAction).description);

    default:
      return state;
  }
}