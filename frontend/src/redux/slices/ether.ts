import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { RootState } from "@/redux/store";
import { HARDHAT_NETWORKID, ContractInfo } from "@/constants";

declare const window: any;

export enum EtherChainStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  FAILURE = "failure"
}

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
  error: string;
  // The info of the token (i.e. It"s Name and symbol)
  tokenData: TokenData;
  wallet: Wallet;
}

const INITIAL_ETHER_Chain_STATE: EtherChain = {
  status: EtherChainStatus.IDLE,
  error: undefined,
  tokenData: undefined,
  wallet: undefined
};

interface ConnectWalletResponse {
  tokenData: TokenData;
  wallet: Wallet;
}

// export type RootState = ReturnType<typeof store.getState>;
export const connectWallet = createAsyncThunk<ConnectWalletResponse, void, { state: RootState }>("ether/connectWalletByStatus", async (_, { getState, dispatch, requestId }) => {
  const { status } = getState().ether;

  // const { currentRequestId, loading } = getState()
  if (status !== EtherChainStatus.PENDING /* ||requestId !== currentRequestId */) {
    return;
  }

  if (window.ethereum === undefined) throw Error("Please install MetaMask.");

  if (window.ethereum.networkVersion !== HARDHAT_NETWORKID) throw Error("Please connect Metamask to Localhost:8545");

  let selectedAddress: string;
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    if (!accounts.length) throw Error("No accounts found");
    selectedAddress = accounts[0];
  } catch (err) {
    throw Error(err);
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(ContractInfo.address, ContractInfo.abi, provider.getSigner(0));

  try {
    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    const balance = await contract.balanceOf(selectedAddress);

    window.ethereum.on("accountsChanged", async ([newAddress]: string[] | undefined) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        dispatch(setError("Invalid address"));
        return;
      }

      dispatch(changeAccount());
      try {
        const balance = await contract.balanceOf(newAddress);
        dispatch(changeAccountSuccess({ address: newAddress, balance: balance.toString() }));
      } catch (err) {
        dispatch(setError(err));
      }
    });

    // We reset the dapp state if the network is changed
    window.ethereum.once("chainChanged", ([networkId]: string[] | undefined) => {
      dispatch(reset());
    });

    return {
      tokenData: { name: tokenName, symbol: tokenSymbol },
      wallet: { address: selectedAddress, balance: balance.toString() }
    };
  } catch (err) {
    throw Error(err);
  }
  // const response = await userAPI.fetchById(userId)
  // return response.data
});

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
    dismissError: (state) => {
      state.error = undefined;
    },
    reset: () => INITIAL_ETHER_Chain_STATE
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state, action) => {
        if (state.status === EtherChainStatus.IDLE) {
          state.status = EtherChainStatus.PENDING;
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
          state.error = undefined;
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

export const { changeAccount, changeAccountSuccess, setError, dismissError, reset } = etherSlice.actions;

export default etherSlice;
