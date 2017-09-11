import { Map } from 'immutable';
import {
  FirebaseActions,
} from '../firebase';

interface IModel {
  id: string,
  content: string,
}

interface IArgs {
  id: string,
}

describe('actions', () => {
  const actions = new FirebaseActions<IModel, IArgs>('TEST');
  const args = { id: 'id' };

  describe('firebase', () => {
    describe('beforeStartListening', () => {
      it('should create a valid action', () => {
        const result = actions.beforeStartListening(args);
        expect(result.type).toEqual(actions.BEFORE_START_LISTENING);
        expect(result.args).toEqual(args);
      })
    }),
    describe('startListening', () => {
      it('should create a valid action', () => {
        const result = actions.startListening(args);
        expect(result.type).toEqual(actions.START_LISTENING);
        expect(result.args).toEqual(args);
      })
    }),
    describe('beforeStopListening', () => {
      it('should create a valid action', () => {
        const result = actions.beforeStopListening(args);
        expect(result.type).toEqual(actions.BEFORE_STOP_LISTENING);
        expect(result.args).toEqual(args);
      })
    }),
    describe('stopListening', () => {
      it('should create a valid action', () => {
        const result = actions.stopListening(args);
        expect(result.type).toEqual(actions.STOP_LISTENING);
        expect(result.args).toEqual(args);
      })
    }),
    describe('objectReceived', () => {
      it('should create a valid action', () => {
        const data = {
          ...args,
          content: 'content',
        };
        const result = actions.objectReceived(args, data);
        expect(result.type).toEqual(actions.RECEIVED);
        expect(result.args).toEqual(args);
        expect(result.data).toEqual(data);
      })
    }),
    describe('listReceived', () => {
      it('should create a valid action', () => {
        const data = Map<string, any>({
          id1: {
            id: 'id1',
            content: 'content1',
          },
          id2: {
            id: 'id2',
            content: 'content2',
          }
        });
        const result = actions.listReceived(args, data);
        expect(result.type).toEqual(actions.RECEIVED);
        expect(result.args).toEqual(args);
        expect(result.data.get('id1')).toEqual(data.get('id1'));
        expect(result.data.get('id2')).toEqual(data.get('id2'));
      })
    }),
    describe('setIsLoading', () => {
      it('should create a valid action', () => {
        const result = actions.setIsLoading(args, true);
        expect(result.type).toEqual(actions.SET_IS_LOADING);
        expect(result.args).toEqual(args);
        expect(result.isLoading).toEqual(true);
      })
    }),
    describe('error', () => {
      it('should create a valid action', () => {
        const result = actions.error(args, 'error');
        expect(result.type).toEqual(actions.ERROR);
        expect(result.args).toEqual(args);
        expect(result.error).toEqual('error');
      })
    })
  })
})