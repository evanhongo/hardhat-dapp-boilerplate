import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import localforage from "localforage";

import etherSlice from "@/redux/slices/ether";
import themeSlice from "@/redux/slices/theme";
import { NODE_ENV } from "@/config";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistentReducer = persistReducer(
  {
    key: "hardhat-hackathon",
    storage: localforage,
    whitelist: [themeSlice.name]
  },
  combineReducers({ [themeSlice.name]: themeSlice.reducer, [etherSlice.name]: etherSlice.reducer })
);

const logger = createLogger({ collapsed: true });

export const store = configureStore({
  reducer: persistentReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }).concat(logger),
  devTools: NODE_ENV === "development"
});

export const persistor = persistStore(store, null, () => {
  // this will be invoked after rehydration is complete
});

setupListeners(store.dispatch);
