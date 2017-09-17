import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../actions/edit-deck'
import {
  editDeck,
} from '../edit-deck'

describe('reducers', () => {
  describe('editDeck', () => {
    describe('initialState', () => {
      it('should initialize all properties', () => {
        const state = editDeck(undefined, { type: '@@TEST' })
        expect(state).toBeTruthy()
        expect(state.has('name')).toBeTruthy()
        expect(state.get('name')).toBeNull()
        expect(state.has('description')).toBeTruthy()
        expect(state.get('description')).toBeNull()
      })
    }),
    describe('setName', () => {
      it('should update state', () => {
        const state = editDeck(undefined, editDeckSetName('myName'))
        expect(state.get('name')).toEqual('myName')
      })
    }),
    describe('setDescription', () => {
      it('should update state', () => {
        const state = editDeck(undefined, editDeckSetDescription('myDescription'))
        expect(state.get('description')).toEqual('myDescription')
      })
    })
  })
})
