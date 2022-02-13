import { useCallback } from "react";
import { Loader } from "@evanhongo/react-custom-component/es";
import { BsFillWalletFill } from "react-icons/bs";

import { NetworkErrorMessage } from "./NetworkErrorMessage";
import { useContract } from "../hooks";

export const Header = () => {
  const { state, connectWallet, dismissNetworkError } = useContract();
  const { selectedAddress, loading, networkError } = state;
  const renderBtn = useCallback(
    (address: string | undefined, loading: boolean, error: string | undefined) =>
      error?.includes("install") ? <></> : loading ? (
        <div className="my-5">
          <Loader type="spinning" />
        </div>
      ) : (
        <button
          onClick={!address && connectWallet}
          className="flex flex-row justify-center items-center my-5 bg-[#545256] py-3 px-5 rounded-full cursor-pointer hover:bg-[#2E2C30] focus:outline outline-2 outline-dashed"
        >
          <BsFillWalletFill className="mt-1 text-white " />
          <p className="ml-2 text-white font-semibold">
            {(address &&
              `${address.substring(0, 6)}...${address.substring(36, 43)}`) ||
              "Connect Wallet"}
          </p>
        </button>
      ),
    [connectWallet]
  );

  return (
    <div className="flex flex-row-reverse items-center w-full h-[5rem] white-glassmorphism">
      <div className="mr-3">
        {renderBtn(selectedAddress, loading, networkError)}
      </div>
      <div className="mr-3">
        {/* Metamask network should be set to Localhost:8545. */}
        {networkError && (
          <NetworkErrorMessage
            message={networkError}
            dismiss={dismissNetworkError}
          />
        )}
      </div>
    </div>
  );
};
