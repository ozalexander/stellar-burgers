import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getIngredientsApi,
  getOrdersApi,
  getFeedsApi,
  orderBurgerApi,
  getUserApi,
  registerUserApi,
  TRegisterData,
  logoutApi,
  updateUserApi
} from '@api';
import { TIngredient, TOrder } from '../utils/types';

interface StoreState {
  isLoading: boolean;
  ingredients: TIngredient[];
  constructorItems: {
    bun: Partial<TIngredient>;
    ingredients: TIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isModalOpen: boolean;
  isAuthenticated: boolean;
  userOrders: TOrder[];
  user: {
    name: string;
    email: string;
  };
  orders: TOrder[];
  total: number;
  totalToday: number;
  isInit: boolean;
}

const initialState: StoreState = {
  isLoading: true,
  ingredients: [],
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  isModalOpen: false,
  isAuthenticated: false,
  userOrders: [],
  user: {
    name: '',
    email: ''
  },
  orders: [],
  total: 0,
  totalToday: 0,
  isInit: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);
export const createNewOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: string[]) => orderBurgerApi(data)
);
export const fetchUsersOrders = createAsyncThunk('user/orders', async () =>
  getOrdersApi()
);
export const fetchFeed = createAsyncThunk('user/feed', async () =>
  getFeedsApi()
);

export const getUser = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

export const registerNewUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const logOutUser = createAsyncThunk('user/logout', async () => {
  logoutApi();
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: TRegisterData) => updateUserApi(user)
);

export const storeSlice = createSlice({
  name: 'store',
  initialState: initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push(action.payload);
      }
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    moveItemUp: (state, action) => {
      const index = action.payload;
      if (index > 0) {
        state.constructorItems.ingredients.splice(
          index - 1,
          0,
          state.constructorItems.ingredients.splice(index, 1)[0]
        );
      }
    },
    moveItemDown: (state, action) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        state.constructorItems.ingredients.splice(
          index + 1,
          0,
          state.constructorItems.ingredients.splice(index, 1)[0]
        );
      }
    },
    deleteItem: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== action.payload
        );
    },
    resetOrder: (state) => {
      state.constructorItems = {
        bun: {
          price: 0
        },
        ingredients: []
      };
      state.orderRequest = false;
      state.orderModalData = null;
    },
    init(state) {
      state.isInit = true;
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectIsLoading: (state) => state.isLoading,
    selectOrderModalData: (state) => state.orderModalData,
    selectIsModalOpen: (state) => state.isModalOpen,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUserOrders: (state) => state.userOrders,
    selectUser: (state) => state.user,
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectIsInit: (state) => state.isInit
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Ошибка:', action.error);
      })
      .addCase(createNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUsersOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsersOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUsersOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(registerNewUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerNewUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(registerNewUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })
      .addCase(logOutUser.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  selectIngredients,
  selectIsLoading,
  selectOrderModalData,
  selectIsModalOpen,
  selectIsAuthenticated,
  selectUserOrders,
  selectUser,
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectConstructorItems,
  selectOrderRequest,
  selectIsInit
} = storeSlice.selectors;
export const {
  addIngredient,
  openModal,
  closeModal,
  moveItemUp,
  moveItemDown,
  resetOrder,
  deleteItem,
  init
} = storeSlice.actions;

export default storeSlice.reducer;
