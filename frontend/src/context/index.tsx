import { ReactNode
} from "react";
import { Provider } from "react-redux";

import { store } from "@/store";

interface EtherProviderProps {
  children: ReactNode
}

export const EtherProvider = ({ children }: EtherProviderProps) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};
