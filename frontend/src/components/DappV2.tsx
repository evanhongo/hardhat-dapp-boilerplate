import { useRoutes } from "react-router-dom";

import { Header } from "@/components/Header";
import { routeRules } from "@/routes";

export const Dapp = () => {
  const routes = useRoutes(routeRules);

  return (
    <>
      <Header />
      {routes}
    </>
  );
};
