import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import localforage from 'localforage';

import { etherReducer, walletReducer } from "@/redux/slices/ether";

const persistentReducer = persistReducer(
  {
    key: 'hardhat-hackathon',
    storage: localforage
  },
  combineReducers({ ether: etherReducer, wallet: walletReducer }),
)

export const store = configureStore({
  reducer: persistentReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }
  })
});

export const persistor = persistStore(store, null, () => {
  // this will be invoked after rehydration is complete
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
