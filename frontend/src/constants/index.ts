import contractAddress from "@/contracts/contract-address.json";
import contractArtifacts from "@/contracts/contract-artifacts.json";

export const HARDHAT_NETWORKID = "31337";
export const ContractInfo = {
    address: contractAddress.address,
    abi: contractArtifacts.abi
};
export const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
export const INITIAL_DAPP_STATE = {
    loading: false,
    contract: undefined,
    tokenData: undefined,
    selectedAddress: undefined,
    balance: undefined,
    networkError: undefined
}