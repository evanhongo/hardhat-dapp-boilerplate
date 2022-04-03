import { useCallback, useEffect } from "react";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";

import { HARDHAT_NETWORKID, ContractInfo } from "@/constants";
import {
  _connectWallet,
  _connectWalletSuccess,
  _getError,
  _changeAccount,
  _changeAccountSuccess,
  _dismissError,
  _reset,
} from "@/slices/ether";
import type { RootState, AppDispatch } from "@/store";

declare const window: any;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

export const useEtherChain = () => {
  const state = useAppSelector((state) => state.ether);
  const dispatch = useAppDispatch();

  const connect = useCallback(async () => {
    dispatch(_connectWallet());
    if (window.ethereum.networkVersion !== HARDHAT_NETWORKID) {
      dispatch(_getError("Please connect Metamask to Localhost:8545"));
      return;
    }

    let selectedAddress: string;
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts.length) throw Error("No accounts found");
      selectedAddress = accounts[0];
    } catch (err) {
      dispatch(_getError(err));
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      ContractInfo.address,
      ContractInfo.abi,
      provider.getSigner(0)
    );
    // The next three methods just read from the contract and store the results
    // in the component state.
    try {
      const tokenName = await contract.name();
      const tokenSymbol = await contract.symbol();
      const balance = await contract.balanceOf(selectedAddress);
      dispatch(
        _connectWalletSuccess({
          tokenData: { name: tokenName, symbol: tokenSymbol },
          walletInput: { address: selectedAddress, balance: balance.toString() },
        })
      );
    } catch (err) {
      dispatch(_getError(err));
      return;
    }

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on(
      "accountsChanged",
      async ([newAddress]: string[] | undefined) => {
        // `accountsChanged` event can be triggered with an undefined newAddress.
        // This happens when the user removes the Dapp from the "Connected
        // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
        // To avoid errors, we reset the dapp state
        if (newAddress === undefined) {
          dispatch(_getError("Invalid address"));
          return;
        }
        
        dispatch(_changeAccount());
        try {
          const balance = await contract.balanceOf(newAddress);
          dispatch(_changeAccountSuccess({ address: newAddress, balance: balance.toString() }));
        } catch (err) {
          dispatch(_getError(err));
          return;
        }
      }
    );

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]: string[] | undefined) => {
      dispatch(_reset());
    });
  }, []);

  const dismissError = useCallback(() => {
    dispatch(_dismissError());
  }, []);

  useEffect(() => {
    if (window.ethereum === undefined)
      dispatch(_getError("Please install MetaMask."));
  }, []);

  return { state, connect, dismissError };
};

export const useWallet = () => {
  const wallet = useAppSelector((state) => state.wallet);
  return { wallet };
}