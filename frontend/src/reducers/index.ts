import { Contract } from "ethers";

import { DappState } from "@/types";
import { INITIAL_DAPP_STATE } from "@/constants";

export const reducer = (state: DappState, action: { type: string, payload?: Record<string, string | number | Contract> }): DappState => {
  switch (action.type) {
    case "CONNECT_WALLET":
      return {
        ...state,
        loading: true
      }
    case "GET_WALLET_INFO":
      return {
        ...state,
        loading: false,
        contract: action.payload?.contract as Contract,
        tokenData: {
          name: action.payload?.tokenName as string,
          symbol: action.payload?.tokenSymbol as string
        },
        selectedAddress: action.payload?.account as string,
        balance: action.payload?.balance as number
      }
    case "CHANGE_ACCOUNT":
      return {
        ...state,
        loading: false,
        selectedAddress: action.payload?.account as string,
        balance: action.payload?.balance as number
      }
    case "GET_NETWORK_ERROR":
      return {
        ...state,
        loading: false,
        networkError: action.payload?.message as string
      }
    case "DISMISS_NETWORK_ERROR":
      return {
        ...state,
        networkError: undefined
      }
    case "RESET":
      return INITIAL_DAPP_STATE
    default:
      return state
  }
}