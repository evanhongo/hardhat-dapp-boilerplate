import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { RootState } from "@/redux/store";
import { EtherChainStatus, ContractInfo } from "@/constants";
import { genProviderOptions } from "@/utils/ether";

interface TokenData {
  name: string;
  symbol: string;
}

interface Wallet {
  address: string;
  balance: string;
}

interface EtherChain {
  status: EtherChainStatus;
  error: string | undefined;
  tokenData: TokenData | undefined;
  wallet: Wallet | undefined;
}

interface ConnectWalletResponse {
  tokenData: TokenData;
  wallet: Wallet;
}

const INITIAL_ETHER_Chain_STATE: EtherChain = {
  status: EtherChainStatus.IDLE,
  error: undefined,
  tokenData: undefined,
  wallet: undefined
};

let provider: any, web3: ethers.providers.Web3Provider;
export const connectWallet = createAsyncThunk<
  ConnectWalletResponse,
  void,
  { state: RootState }
>(
  "ether/connectWallet",
  async (_, { getState, dispatch, requestId }) => {
    const { status } = getState().ether;

    // const { currentRequestId, loading } = getState()
    if (
      status !== EtherChainStatus.PENDING /* ||requestId !== currentRequestId */
    ) {
      return;
    }

    const providerOptions = genProviderOptions();
    const web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      // cacheProvider: true, // optional
      providerOptions // required
    });

    try {
      if(!provider || !web3){
        provider = await web3Modal.connect();
        web3 = new ethers.providers.Web3Provider(provider);
      }
      const accounts = await web3.listAccounts();
      if (!accounts.length)
        throw Error("No accounts found");

      const contract = new ethers.Contract(
        ContractInfo.address,
        ContractInfo.abi,
        web3.getSigner()
      );
      const tokenName = await contract.name();
      const tokenSymbol = await contract.symbol();
      const balance = await contract.balanceOf(accounts[0]);

      provider.on("accountsChanged", () => {
        dispatch(reset());
      });

      provider.once("chainChanged", () => {
        dispatch(reset());
      });

      provider.on("disconnect", (error: { code: number; message: string }) => {
        console.error(error);
        dispatch(reset());
      });

      return {
        tokenData: { name: tokenName, symbol: tokenSymbol },
        wallet: { address: accounts[0], balance: balance.toString() }
      };
    } catch (err) {
      throw Error(err);
    }
  }
);

const etherSlice = createSlice({
  name: "ether",
  initialState: INITIAL_ETHER_Chain_STATE,
  reducers: {
    setError: (state, action) => {
      state.status = EtherChainStatus.FAILURE;
      state.error = action.payload;
    },
    reset: () => INITIAL_ETHER_Chain_STATE
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        if ([EtherChainStatus.IDLE, EtherChainStatus.FAILURE].includes(state.status)) {
          state.status = EtherChainStatus.PENDING;
          state.error = undefined;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.status === EtherChainStatus.PENDING /* &&
        state.currentRequestId === requestId */
        ) {
          state.status = EtherChainStatus.SUCCESS;
          state.tokenData = action.payload.tokenData;
          state.wallet = action.payload.wallet;
          // state.currentRequestId = undefined
        }
      })
      .addCase(connectWallet.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.status === EtherChainStatus.PENDING // &&
          // state.currentRequestId === requestId
        ) {
          state.status = EtherChainStatus.FAILURE;
          state.error = action.error.message;
          // state.currentRequestId = undefined
        }
      })
  }
});

export const {
  setError,
  reset
} = etherSlice.actions;

export default etherSlice;
