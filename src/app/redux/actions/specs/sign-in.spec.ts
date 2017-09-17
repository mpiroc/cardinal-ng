import {
  SIGN_IN_SET_EMAIL,
  SIGN_IN_SET_PASSWORD,
  SIGN_IN_SET_REMEMBER_ME,
  SIGN_IN_SUBMIT,
  SIGN_IN_SUBMIT_SUCCESS,
  SIGN_IN_SUBMIT_USER_ERROR,
  SIGN_IN_SUBMIT_PASSWORD_ERROR,
  SIGN_IN_SUBMIT_PROVIDER_ERROR,
  signInSetEmail,
  signInSetPassword,
  signInSetRememberMe,
  signInSubmit,
  signInSubmitSuccess,
  signInSubmitUserError,
  signInSubmitPasswordError,
  signInSubmitProviderError,
} from '../sign-in'

describe('actions', () => {
  describe('signIn', () => {
    describe('setEmail', () => {
      it('should create a valid action', () => {
        const result = signInSetEmail('email')
        expect(result.type).toEqual(SIGN_IN_SET_EMAIL)
        expect(result.email).toEqual('email')
      })
    }),
    describe('setPassword', () => {
      it('should create a valid action', () => {
        const result = signInSetPassword('password')
        expect(result.type).toEqual(SIGN_IN_SET_PASSWORD)
        expect(result.password).toEqual('password')
      })
    }),
    describe('setRememberMe', () => {
      it('should create a valid action', () => {
        const result = signInSetRememberMe(true)
        expect(result.type).toEqual(SIGN_IN_SET_REMEMBER_ME)
        expect(result.rememberMe).toEqual(true)
      })
    }),
    describe('submit', () => {
      it('should create a valid action', () => {
        const result = signInSubmit()
        expect(result.type).toEqual(SIGN_IN_SUBMIT)
      })
    }),
    describe('submitSuccess', () => {
      it('should create a valid action', () => {
        const result = signInSubmitSuccess()
        expect(result.type).toEqual(SIGN_IN_SUBMIT_SUCCESS)
      })
    }),
    describe('submitUserError', () => {
      it('should create a valid action', () => {
        const result = signInSubmitUserError('error')
        expect(result.type).toEqual(SIGN_IN_SUBMIT_USER_ERROR)
        expect(result.error).toEqual('error')
      })
    }),
    describe('submitPasswordError', () => {
      it('should create a valid action', () => {
        const result = signInSubmitPasswordError('error')
        expect(result.type).toEqual(SIGN_IN_SUBMIT_PASSWORD_ERROR)
        expect(result.error).toEqual('error')
      })
    }),
    describe('submitProviderError', () => {
      it('should create a valid action', () => {
        const result = signInSubmitProviderError('error')
        expect(result.type).toEqual(SIGN_IN_SUBMIT_PROVIDER_ERROR)
        expect(result.error).toEqual('error')
      })
    })
  })
})
