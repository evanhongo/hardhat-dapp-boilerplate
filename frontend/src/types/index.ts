import { Contract } from "ethers";

export type DappState = {
    loading: boolean,
    contract?: Contract,
    // The info of the token (i.e. It's Name and symbol)
    tokenData?: {
        name: string,
        symbol: string
    },
    // The user's address and balance
    selectedAddress?: string,
    balance?: number,
    networkError?: string,
}