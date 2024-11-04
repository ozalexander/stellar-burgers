import reducer, { initialState } from '../src/slices/storeSlice';
import { fetchUsersOrders, createNewOrder } from '../src/slices/storeSlice';
import { mockFeed } from './feedReducer';

const mockOrder = {
  order: {
    success: true,
    name: 'test',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093e'
    ],
    number: 4975,
    status: 'done',
    createdAt: '2023-06-05T15:00:00.000Z',
    updatedAt: '2023-06-05T15:00:00.000Z',
    _id: '643d69a5c3f7b9001cfa0940'
  }
};

describe('Fetch users orders', () => {
  test('Request', () => {
    const state = reducer(initialState, fetchUsersOrders.pending('pending'));
    expect(state.isLoading).toBeTruthy();
  });
  test('Success', () => {
    const state = reducer(
      initialState,
      fetchUsersOrders.fulfilled(
        {
          orders: mockFeed.orders
        },
        'fulfilled'
      )
    );
    expect(state.userOrders).toEqual(mockFeed.orders);
  });
  test('Failed', () => {
    const state = reducer(
      initialState,
      fetchUsersOrders.rejected(new Error('fetch rejected'), 'failed')
    );
    expect(state.error).toEqual('fetch rejected');
    expect(state.isLoading).toBeFalsy();
  });
});

describe('Create new order', () => {
  test('Request', () => {
    const state = reducer(
      initialState,
      createNewOrder.pending('pending', mockOrder.order.ingredients as any)
    );
    expect(state.isLoading).toBeTruthy();
    expect(state.orderRequest).toBeTruthy();
  });
  test('Success', () => {
    const state = reducer(
      initialState,
      createNewOrder.fulfilled(
        { order: mockFeed.orders, name: 'test' },
        'fulfilled',
        mockOrder.order.ingredients as any
      )
    );
    expect(state.orderModalData).toEqual(mockFeed.orders);
  });
  test('Failed', () => {
    const state = reducer(
      initialState,
      createNewOrder.rejected(new Error('fetch rejected'), 'failed', [] as any)
    );
    expect(state.error).toEqual('fetch rejected');
    expect(state.isLoading).toBeFalsy();
    expect(state.orderRequest).toBeFalsy();
  });
});
