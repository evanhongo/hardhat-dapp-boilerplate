import { useCallback, useEffect } from "react";
import { Loader } from "@evanhongo/react-custom-component";
import { BsFillWalletFill } from "react-icons/bs";
import toast from "react-hot-toast";

import { NetworkErrorMessage } from "@/components/NetworkErrorMessage";
import { connectWallet, dismissError } from "@/redux/slices/ether";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { EtherChainStatus } from "@/constants";

const Header = () => {
  const state = useAppSelector((state) => state.ether);
  const dispatch = useAppDispatch();
  const { status, error, wallet } = state;

  useEffect(() => {
    if (error) toast.error(error, { duration: 5000 });
  }, [error]);

  const connect = useCallback(() => {
    dispatch(connectWallet({ provider: "metamask" }));
  }, []);

  const renderBtn = useCallback(
    (address: string | undefined, status: string) =>
      status === EtherChainStatus.PENDING ? (
        <div className="my-5">
          <Loader type="spinning" />
        </div>
      ) : (
        <button
          onClick={!address ? connect : undefined}
          className="flex flex-row justify-center items-center my-5 bg-[#545256] py-3 px-5 rounded-full cursor-pointer hover:bg-[#2E2C30] focus:outline outline-2 outline-dashed"
        >
          <BsFillWalletFill className="mt-1 text-white " />
          <p className="ml-2 text-white font-semibold">
            {address
              ? `${address.substring(0, 6)}...${address.substring(36, 43)}`
              : "Connect Wallet"}
          </p>
        </button>
      ),
    [connect]
  );

  return (
    <div className="flex flex-row-reverse items-center w-full h-[5rem] white-glassmorphism">
      <div className="mr-3">{renderBtn(wallet?.address, status)}</div>
    </div>
  );
};

export default Header;
