import { ReactNode
} from "react";
import { Provider } from "react-redux";

import { store } from "@/store";

interface ContractProviderProps {
  children: ReactNode
}

export const ContractProvider = ({ children }: ContractProviderProps) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};
