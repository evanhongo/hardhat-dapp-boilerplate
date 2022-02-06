// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";
import { useContract } from "../hooks";

export const Dapp = () => {
  const { state } = useContract();
  const { loading, networkError, selectedAddress, balance, tokenData } = state;
  // Ethereum wallets inject the window.ethereum object. If it hasn't been
  // injected, we instruct the user to install MetaMask.
  if (networkError?.includes("MetaMask"))
    return <NoWalletDetected />;

  if (loading)
    return <Loading />;

  // The next thing we need to do, is to ask the user to connect their wallet.
  // When the wallet gets connected, we are going to save the users's address
  // in the component's state. So, if it hasn't been saved yet, we have
  // to show the ConnectWallet component.
  //
  // Note that we pass it a callback that is going to be called when the user
  // clicks a button. This callback just calls the connectWallet method.
  if (!selectedAddress)
    return <ConnectWallet />;

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-12">
          <h1>
            {tokenData?.name} ({tokenData?.symbol})
          </h1>
          <p>
            Welcome <b>{selectedAddress}</b>, you have&nbsp;
            <b>
              {`${balance} ${tokenData?.symbol}`}
            </b>
          </p>
        </div>
      </div>

      
    </div>
  );
}