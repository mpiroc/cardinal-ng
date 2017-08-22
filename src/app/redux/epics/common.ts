import { Map } from 'immutable';
import { IFirebaseModel } from '../../models/firebase-models';

export function convertToMap<T extends IFirebaseModel>(userDecks: T[]) : Map<string, T> {
  return userDecks.reduce(
    (result, current) => result.set(current.$key, current),
    Map<string, T>());
}