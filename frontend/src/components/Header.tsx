import { useCallback } from "react";
import { Loader } from "@evanhongo/react-custom-component/es";
import { BsFillWalletFill } from "react-icons/bs";

import { useAppSelector, useAppDispatch } from "@/context";
import { NetworkErrorMessage } from "@/components/NetworkErrorMessage";
import { EtherChainStatus, connectWallet, dismissError } from "@/redux/slices/ether";

export const Header = () => {
  const state = useAppSelector((state) => state.ether);
  const dispatch = useAppDispatch();
  const { status, error, wallet } = state;

  const connect = () => {
    dispatch(connectWallet());
  };

  const dismiss = () => {
    dispatch(dismissError());
  };

  const renderBtn = useCallback(
    (address: string | undefined, status: string, error: string | undefined) => (error?.includes("install") ? (
      <></>
    ) : status === EtherChainStatus.PENDING ? (
      <div className="my-5">
        <Loader type="spinning" />
      </div>
    ) : (
      <button onClick={!address ? connect : undefined} className="flex flex-row justify-center items-center my-5 bg-[#545256] py-3 px-5 rounded-full cursor-pointer hover:bg-[#2E2C30] focus:outline outline-2 outline-dashed">
        <BsFillWalletFill className="mt-1 text-white " />
        <p className="ml-2 text-white font-semibold">{(address && `${address.substring(0, 6)}...${address.substring(36, 43)}`) || "Connect Wallet"}</p>
      </button>
    )),
    [connect]
  );

  return (
    <div className="flex flex-row-reverse items-center w-full h-[5rem] white-glassmorphism">
      <div className="mr-3">{renderBtn(wallet?.address, status, error)}</div>
      <div className="mr-3">
        {/* Metamask network should be set to Localhost:8545. */}
        {error && <NetworkErrorMessage message={error} dismiss={dismiss} />}
      </div>
    </div>
  );
};
