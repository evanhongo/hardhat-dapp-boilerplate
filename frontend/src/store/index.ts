import { configureStore } from "@reduxjs/toolkit";

import { etherReducer, walletReducer } from "@/slices/ether";

export const store = configureStore({
  reducer: { ether: etherReducer, wallet: walletReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
