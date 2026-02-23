import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICart, ICartItem } from "../types/Cart";
import { removeItemFromCart } from "../services/apiCart";

interface CartState {
  cartId: number | null;
  items: ICartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  alert: string | null;
}

const initialState: CartState = {
  cartId: 0,
  items: [],
  total: 0,
  loading: false,
  error: null,
  alert: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cartSuccess: (state, action: PayloadAction<ICart>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.cartId = action.payload.id;
    },
    cartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCartState: (state) => {
      state.items = [];
      state.total = 0;
    },
    cartRemoveItem: (state, actions: PayloadAction<number>) => {

      const productIdToRemove = actions.payload;
      state.items = state.items.filter(
        (item) => item.productId !== productIdToRemove
      );
    },
    cartAddItem: (state, action: PayloadAction<ICartItem>) => {
      //Sumar productos iguales
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total += action.payload.price * action.payload.quantity;
      state.loading = false;
    },
    setAlert: (state, action: PayloadAction<string | null>) => {
      state.alert = action.payload;
    },
  },
});

export const {
  cartStart,
  cartSuccess,
  cartFailure,
  cartAddItem,
  clearCartState,
  cartRemoveItem,
  setAlert,
} = cartSlice.actions;
export default cartSlice.reducer;
