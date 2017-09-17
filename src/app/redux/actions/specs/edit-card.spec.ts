import {
  EDIT_CARD_SET_FRONT,
  EDIT_CARD_SET_BACK,
  editCardSetFront,
  editCardSetBack,
} from '../edit-card'

describe('actions', () => {
  describe('editCard', () => {
    describe('setFront', () => {
      it('should create a valid action', () => {
        const result = editCardSetFront('front')
        expect(result.type).toEqual(EDIT_CARD_SET_FRONT)
        expect(result.front).toEqual('front')
      })
    }),
    describe('setBack', () => {
      it('should create a valid action', () => {
        const result = editCardSetBack('back')
        expect(result.type).toEqual(EDIT_CARD_SET_BACK)
        expect(result.back).toEqual('back')
      })
    })
  })
})
