import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getIngredientsApi,
  getOrdersApi,
  getFeedsApi,
  orderBurgerApi,
  getUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  loginUserApi,
  resetPasswordApi
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
  error: string | undefined;
}

export const initialState: StoreState = {
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
  isInit: false,
  error: undefined
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);
export const createNewOrder = createAsyncThunk(
  'orders/createOrder',
  orderBurgerApi
);
export const fetchUsersOrders = createAsyncThunk('user/orders', getOrdersApi);
export const fetchFeed = createAsyncThunk('user/feed', getFeedsApi);
export const getUser = createAsyncThunk('user/getUser', getUserApi);
export const loginUser = createAsyncThunk('user/login', loginUserApi);
export const registerNewUser = createAsyncThunk(
  'user/register',
  registerUserApi
);
export const logOutUser = createAsyncThunk('user/logout', logoutApi);
export const updateUser = createAsyncThunk('user/update', updateUserApi);
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  resetPasswordApi
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
    },
    setError(state, action) {
      state.error = action.payload;
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
    selectError: (state) => state.error,
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
        state.error = action.error.message;
      })
      .addCase(createNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.isLoading = false;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.error.message;
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
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
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
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsersOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsersOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload.orders;
      })
      .addCase(fetchUsersOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(registerNewUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
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
  selectIsInit,
  selectError
} = storeSlice.selectors;
export const {
  addIngredient,
  openModal,
  closeModal,
  moveItemUp,
  moveItemDown,
  resetOrder,
  deleteItem,
  init,
  setError
} = storeSlice.actions;

export default storeSlice.reducer;
