import { Map } from 'immutable';

export function get(map: Map<string, any>, ...path: string[]): any {
  return path.reduce((accumulator, current) => {
    if (accumulator === undefined) {
      return undefined;
    }

    return (accumulator as Map<string, any>).get(current);
  }, map);
}