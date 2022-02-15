import { useContext } from "react";

import { ContractContext } from "@/context";

export const useContract = () => useContext(ContractContext);
