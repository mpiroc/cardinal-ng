import {
  RESET_PASSWORD_SET_EMAIL,
  resetPasswordSetEmail,
} from '../reset-password'

describe('actions', () => {
  describe('resetPassword', () => {
    describe('setEmail', () => {
      it('should create a valid action', () => {
        const result = resetPasswordSetEmail('email')
        expect(result.type).toEqual(RESET_PASSWORD_SET_EMAIL)
        expect(result.email).toEqual('email')
      })
    })
  })
})
