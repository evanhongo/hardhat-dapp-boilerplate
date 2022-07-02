import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import Web3Modal, { IProviderOptions } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Torus from "@toruslabs/torus-embed";

import { RootState } from "@/redux/store";
import { HARDHAT_NETWORKID, EtherChainStatus, ContractInfo } from "@/constants";

declare const window: any;

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

// let web3Modal: any;
// if (typeof window !== "undefined") {
//   web3Modal = new Web3Modal({
//     cacheProvider: false,
//     providerOptions: {
//       walletconnect: {
//         package: WalletConnectProvider, // required
//         options: {
//           rpc: { 42: process.env.NEXT_PUBLIC_RPC_URL } // required
//         }
//       }
//     }
//   });
// }

const genProviderOptions = (provider: string): IProviderOptions => {
  return {
    injected: {
      display: {
        name: "Metamask",
      },
      package: null
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "" // required
      }
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "Web3Modal Example App",
        infuraId: ""
      }
    },
    torus: {
      package: Torus
    },
  };
};

// export type RootState = ReturnType<typeof store.getState>;
export const connectWallet = createAsyncThunk<
  ConnectWalletResponse,
  { provider: string },
  { state: RootState }
>(
  "ether/connectWalletByStatus",
  async (payload, { getState, dispatch, requestId }) => {
    const { status } = getState().ether;

    // const { currentRequestId, loading } = getState()
    if (
      status !== EtherChainStatus.PENDING /* ||requestId !== currentRequestId */
    ) {
      return;
    }

    const providerOptions = genProviderOptions(payload.provider);
    const web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      // cacheProvider: true, // optional
      providerOptions // required
    });

    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const accounts = await provider.listAccounts();
      if (!accounts.length) 
        throw Error("No accounts found");

      provider.on("accountsChanged", async (accounts: string[]) => {
        if (!accounts[0]) {
          dispatch(setError("Invalid address"));
          return;
        }

        dispatch(changeAccount());
        try {
          const balance = await contract.balanceOf(accounts[0]);
          dispatch(
            changeAccountSuccess({
              address: accounts[0],
              balance: balance.toString()
            })
          );
        } catch (err) {
          dispatch(setError(err));
        }
      });

      provider.once("chainChanged", (chainId: number) => {
        dispatch(reset());
      });

      provider.on("disconnect", (error: { code: number; message: string }) => {
        console.log(error);
      });

      const contract = new ethers.Contract(
        ContractInfo.address,
        ContractInfo.abi,
        provider.getSigner()
      );

      const tokenName = await contract.name();
      const tokenSymbol = await contract.symbol();
      const balance = await contract.balanceOf(accounts[0]);

      return {
        tokenData: { name: tokenName, symbol: tokenSymbol },
        wallet: { address: accounts[0], balance: balance.toString() }
      };
    } catch (err: any) {
      throw Error(err);
    }
  }
);

const etherSlice = createSlice({
  name: "ether",
  initialState: INITIAL_ETHER_Chain_STATE,
  reducers: {
    changeAccount: (state) => {
      state.status = EtherChainStatus.PENDING;
    },
    changeAccountSuccess: (state, action: PayloadAction<Wallet>) => {
      state.status = EtherChainStatus.SUCCESS;
      state.wallet = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    reset: () => INITIAL_ETHER_Chain_STATE
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        if (state.status === EtherChainStatus.IDLE) {
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
          state.status = EtherChainStatus.IDLE;
          state.error = action.error.message;
          // state.currentRequestId = undefined
        }
      });
  }
});

export const {
  changeAccount,
  changeAccountSuccess,
  setError,
  dismissError,
  reset
} = etherSlice.actions;

export default etherSlice;
