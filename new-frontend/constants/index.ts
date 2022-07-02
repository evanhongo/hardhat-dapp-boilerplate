import contractAddress from "@/contracts/contract-address.json";
import contractArtifacts from "@/contracts/contract-artifacts.json";

export const HARDHAT_NETWORKID = "31337";
export enum EtherChainStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  FAILURE = "failure"
}
export const ContractInfo = {
  address: contractAddress.address,
  abi: contractArtifacts.abi
};
export const ERROR_CODE_TX_REJECTED_BY_USER = 4001;