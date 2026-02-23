
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/redux/authSlice";
import cartReducer from "../features/Cart/redux/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
