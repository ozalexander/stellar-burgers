import { store, rootReducer } from '../src/services/store';

describe('rootReducer test', () => {
  test('should return the initial state', () => {
    expect(rootReducer.store(undefined, { type: 'action' })).toEqual(
      store.getState().store
    );
  });
});
