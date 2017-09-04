import { Map } from 'immutable';
import { Action } from 'redux';

import {
  EDIT_CARD_SET_FRONT,
  EDIT_CARD_SET_BACK,
  IEditCardSetFrontAction,
  IEditCardSetBackAction,
} from '../actions/edit-card';

const initialState = Map<string, any>({
  front: null,
  back: null,
});

export function editCard(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case EDIT_CARD_SET_FRONT:
      return state.set('front', (action as IEditCardSetFrontAction).front);

    case EDIT_CARD_SET_BACK:
      return state.set('back', (action as IEditCardSetBackAction).back);

    default:
      return state;
  }
}
