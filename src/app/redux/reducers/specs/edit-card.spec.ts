import {
  editCardSetFront,
  editCardSetBack,
} from '../../actions/edit-card';
import {
  editCard,
} from '../edit-card';

describe('reducers', () => {
  describe('editCard', () => {
    describe('initialState', () => {
      it('should initialize all properties', () => {
        const state = editCard(undefined, { type: '@@TEST' });
        expect(state).toBeTruthy();
        expect(state.has('front')).toBeTruthy();
        expect(state.get('front')).toBeNull();
        expect(state.has('back')).toBeTruthy();
        expect(state.get('back')).toBeNull();
      })
    }),
    describe('setFront', () => {
      it('should update state', () => {
        const state = editCard(undefined, editCardSetFront('myFront'));
        expect(state.get('front')).toEqual('myFront');
      })
    }),
    describe('setBack', () => {
      it('should update state', () => {
        const state = editCard(undefined, editCardSetBack('myBack'));
        expect(state.get('back')).toEqual('myBack');
      })
    })
  })
})
