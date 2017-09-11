import { 
  SIGN_UP_SET_EMAIL,
  SIGN_UP_SET_PASSWORD,
  SIGN_UP_SUBMIT,
  SIGN_UP_SUBMIT_SUCCESS,
  SIGN_UP_SUBMIT_USER_ERROR,
  SIGN_UP_SUBMIT_PASSWORD_ERROR,
  SIGN_UP_SUBMIT_PROVIDER_ERROR,
  signUpSetEmail,
  signUpSetPassword,
  signUpSubmit,
  signUpSubmitSuccess,
  signUpSubmitUserError,
  signUpSubmitPasswordError,
  signUpSubmitProviderError,
} from '../sign-up';

describe('actions', () => {
  describe('signUp', () => {
    describe('setEmail', () => {
      it('should create a valid action', () => {
        const result = signUpSetEmail('email');
        expect(result.type).toEqual(SIGN_UP_SET_EMAIL);
        expect(result.email).toEqual('email');
      })
    }),
    describe('setPassword', () => {
      it('should create a valid action', () => {
        const result = signUpSetPassword('password');
        expect(result.type).toEqual(SIGN_UP_SET_PASSWORD);
        expect(result.password).toEqual('password');
      })
    }),
    describe('submit', () => {
      it('should create a valid action', () => {
        const result = signUpSubmit();
        expect(result.type).toEqual(SIGN_UP_SUBMIT);
      })
    }),
    describe('submitSuccess', () => {
      it('should create a valid action', () => {
        const result = signUpSubmitSuccess();
        expect(result.type).toEqual(SIGN_UP_SUBMIT_SUCCESS);
      })
    }),
    describe('submitUserError', () => {
      it('should create a valid action', () => {
        const result = signUpSubmitUserError('error');
        expect(result.type).toEqual(SIGN_UP_SUBMIT_USER_ERROR);
        expect(result.error).toEqual('error');
      })
    }),
    describe('submitPasswordError', () => {
      it('should create a valid action', () => {
        const result = signUpSubmitPasswordError('error');
        expect(result.type).toEqual(SIGN_UP_SUBMIT_PASSWORD_ERROR);
        expect(result.error).toEqual('error');
      })
    }),
    describe('submitProviderError', () => {
      it('should create a valid action', () => {
        const result = signUpSubmitProviderError('error');
        expect(result.type).toEqual(SIGN_UP_SUBMIT_PROVIDER_ERROR);
        expect(result.error).toEqual('error');
      })
    })
  })
})