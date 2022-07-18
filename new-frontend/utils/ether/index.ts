import { IProviderOptions } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Torus from "@toruslabs/torus-embed";

export const genProviderOptions = (): IProviderOptions => {
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