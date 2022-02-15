import { useRoutes } from "react-router-dom";

import { Header } from "@/components/Header";
import { useContract } from "@/hooks";
import { routeRules } from "@/routes";

export const Dapp = () => {
  const { state } = useContract();
  const { loading, networkError, selectedAddress, balance, tokenData } = state;
  const routes = useRoutes(routeRules);
  
  return (
    <>
      <Header />
      { routes }
    </>
  );
}