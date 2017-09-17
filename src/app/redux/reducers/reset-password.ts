import { Map } from 'immutable'
import { Action } from 'redux'

import {
  RESET_PASSWORD_SET_EMAIL,
  IResetPasswordSetEmailAction,
} from '../actions/reset-password'

const initialState = Map<string, any>({
  email: null,
})

export function resetPassword(state: Map<string, any> = initialState, action: Action) {
  switch (action.type) {
    case RESET_PASSWORD_SET_EMAIL:
      return state.set('email', (action as IResetPasswordSetEmailAction).email)

    default:
      return state
  }
}
