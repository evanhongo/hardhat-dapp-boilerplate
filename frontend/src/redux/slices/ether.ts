import { createReducer, createAction } from "@reduxjs/toolkit";

export enum EtherChainStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  FAILURE = "failure",
}

interface TokenData {
  name: string;
  symbol: string;
}

interface EtherChain {
  status: EtherChainStatus;
  error?: string;
  // The info of the token (i.e. It"s Name and symbol)
  tokenData?: TokenData;
}

interface Wallet {
  address: string;
  balance: string;
}

const INITIAL_ETHER_Chain_STATE: EtherChain = {
  status: EtherChainStatus.IDLE,
  error: undefined,
  tokenData: undefined,
};

const INITIAL_WALLET_STATE: Wallet = {
  address: undefined,
  balance: undefined,
};

export const _connectWallet = createAction<undefined, "connectWallet">(
  "connectWallet"
);
export const _connectWalletSuccess = createAction<
  { tokenData: TokenData; walletInput: Wallet },
  "connectWalletSuccess"
>("connectWalletSuccess");
export const _getError = createAction<string, "getError">("getError");
export const _changeAccount = createAction<undefined, "changeAccount">(
  "changeAccount"
);
export const _changeAccountSuccess = createAction<Wallet, "changeAccountSuccess">(
  "changeAccountSuccess"
);
export const _dismissError = createAction<undefined, "dismissError">(
  "dismissError"
);
export const _reset = createAction<undefined, "reset">("reset");

export const etherReducer = createReducer(
  INITIAL_ETHER_Chain_STATE,
  (builder) => {
    builder
      .addCase(_connectWallet, (state) => {
        state.status = EtherChainStatus.LOADING;
      })
      .addCase(_connectWalletSuccess, (state, action) => {
        state.status = EtherChainStatus.SUCCESS;
        state.tokenData = action.payload.tokenData;
      })
      .addCase(_getError, (state, action) => {
        state.status = EtherChainStatus.FAILURE;
        state.error = action.payload;
      })
      .addCase(_dismissError, (state) => {
        state.status = EtherChainStatus.IDLE;
        state.error = undefined;
      })
      .addCase(_changeAccount, (state) => {
        state.status = EtherChainStatus.LOADING;
      })
      .addCase(_changeAccountSuccess, (state) => {
        state.status = EtherChainStatus.SUCCESS;
      })
      .addCase(_reset, () => {
        return INITIAL_ETHER_Chain_STATE;
      });
  }
);

export const walletReducer = createReducer(INITIAL_WALLET_STATE, (builder) => {
  builder
    .addCase(_connectWalletSuccess, (_, action) => {
      return action.payload.walletInput;
    })
    .addCase(_changeAccountSuccess, (_, action) => {
      return action.payload;
    })
    .addCase(_reset, () => {
      return INITIAL_WALLET_STATE;
    });
});
