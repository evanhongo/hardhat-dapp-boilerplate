import { ReactNode
} from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "@/redux/store";

interface EtherProviderProps {
  children: ReactNode
}

export const EtherProvider = ({ children }: EtherProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
