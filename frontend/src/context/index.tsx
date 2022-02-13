import {
  useEffect,
  useCallback,
  useReducer,
  createContext,
  FC
} from "react";
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import { HARDHAT_NETWORKID, INITIAL_DAPP_STATE } from "../constants";
import { DappState } from "../types";
import { reducer } from "../reducers";

declare const window: any;

export const ContractContext = createContext<{
  state: DappState;
  connectWallet?: () => Promise<void>;
  dismissNetworkError?: () => void;
}>({ state: INITIAL_DAPP_STATE });

interface ContractProviderProps {
  contractInfo: {
    address: string;
    abi: ethers.ContractInterface
  }
}

export const ContractProvider: FC<ContractProviderProps> = ({ children, contractInfo }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_DAPP_STATE);

  const connectWallet = useCallback(async () => {
    dispatch({ type: "CONNECT_WALLET" });
    if (window.ethereum.networkVersion !== HARDHAT_NETWORKID) {
      dispatch({ type: "GET_NETWORK_ERROR", payload: { message: "Please connect Metamask to Localhost:8545" } });
      return;
    }

    let selectedAddress: string;
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if(!accounts.length)
        throw Error("No accounts found");
      selectedAddress = accounts[0];      
    }
    catch (err) {
      console.error(err);
      dispatch({ type: "GET_NETWORK_ERROR", payload: { message: err as string } });
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider.getSigner(0));
    // The next three methods just read from the contract and store the results
    // in the component state.
    try {
      const tokenName = await contract.name();
      const tokenSymbol = await contract.symbol();
      const balance = await contract.balanceOf(selectedAddress);
      dispatch({ type: "GET_WALLET_INFO", payload: { contract, tokenName, tokenSymbol, account: selectedAddress, balance } });
    }
    catch (err) {
      console.error(err);
      dispatch({ type: "GET_NETWORK_ERROR", payload: { message: err as string } });
      return
    }

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", async ([newAddress]: string[]| undefined) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        dispatch({ type: "GET_NETWORK_ERROR" });
        return;
      }

      try {
        const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider.getSigner(0));
        const balance = await contract.balanceOf(newAddress);
        dispatch({ type: "CHANGE_ACCOUNT", payload: { account: newAddress, balance } });
      }
      catch (err) {
        console.error(err);
        dispatch({ type: "GET_NETWORK_ERROR", payload: { message: err as string } });
        return
      }
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]: string[] | undefined) => {
      dispatch({ type: "RESET" });
    });
  }, []);

  const dismissNetworkError = useCallback(() => {
    dispatch({ type: "DISMISS_NETWORK_ERROR" });
  }, []);

  useEffect(() => {
    if (window.ethereum === undefined)
      dispatch({ type: "GET_NETWORK_ERROR", payload: { message: "Please install MetaMask." } });  
  }, []);
  
  return (
    <ContractContext.Provider value={{ state, connectWallet, dismissNetworkError }}>
      {children}
    </ContractContext.Provider>
  );
};
