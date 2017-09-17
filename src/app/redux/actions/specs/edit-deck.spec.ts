import {
  EDIT_DECK_SET_NAME,
  EDIT_DECK_SET_DESCRIPTION,
  editDeckSetName,
  editDeckSetDescription,
} from '../edit-deck'

describe('actions', () => {
  describe('editDeck', () => {
    describe('setName', () => {
      it('should create a valid action', () => {
        const result = editDeckSetName('name')
        expect(result.type).toEqual(EDIT_DECK_SET_NAME)
        expect(result.name).toEqual('name')
      })
    }),
    describe('setDescription', () => {
      it('should create a valid action', () => {
        const result = editDeckSetDescription('description')
        expect(result.type).toEqual(EDIT_DECK_SET_DESCRIPTION)
        expect(result.description).toEqual('description')
      })
    })
  })
})
