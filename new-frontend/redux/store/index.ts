import {
  configureStore,
  combineReducers
} from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { createWrapper } from "next-redux-wrapper";

import etherSlice from "@/redux/slices/ether";
import themeSlice from "@/redux/slices/theme";
import { NODE_ENV } from "@/config";

const logger = createLogger({ collapsed: true });

const makeStore = () =>
  configureStore({
    reducer: combineReducers({
      [themeSlice.name]: themeSlice.reducer,
      [etherSlice.name]: etherSlice.reducer
    }),
    middleware: (getDefaultMiddleware) =>
      NODE_ENV !== "production"
        ? getDefaultMiddleware().concat(logger)
        : getDefaultMiddleware()
  });

const store = configureStore({
  reducer: combineReducers({
    [themeSlice.name]: themeSlice.reducer,
    [etherSlice.name]: etherSlice.reducer
  }),
  middleware: (getDefaultMiddleware) =>
    NODE_ENV !== "production"
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const wrapper = createWrapper(makeStore);
