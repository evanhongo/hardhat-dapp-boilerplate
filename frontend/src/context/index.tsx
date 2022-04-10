import { ReactNode } from "react";
import { Provider, TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor, RootState, AppDispatch } from "@/redux/store";

interface EtherProviderProps {
  children: ReactNode;
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const EtherProvider = ({ children }: EtherProviderProps) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>{children}</PersistGate>
  </Provider>
);
