import {
  resetPasswordSetEmail,
} from '../../actions/reset-password'
import {
  resetPassword,
} from '../reset-password'

describe('reducers', () => {
  describe('resetPassword', () => {
    describe('initialState', () => {
      it('should initialize all properties', () => {
        const state = resetPassword(undefined, { type: '@@TEST' })
        expect(state).toBeTruthy()
        expect(state.has('email')).toBeTruthy()
        expect(state.get('email')).toBeNull()
      })
    }),
    describe('setEmail', () => {
      it('should update state', () => {
        const state = resetPassword(undefined, resetPasswordSetEmail('myEmail'))
        expect(state.get('email')).toEqual('myEmail')
      })
    })
  })
})
