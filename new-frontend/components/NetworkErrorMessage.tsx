import { AiFillWarning } from "react-icons/ai";

interface NetworkErrorMessageProps {
  message: string;
  dismiss?: () => void;
}

export const NetworkErrorMessage = ({ message, dismiss }: NetworkErrorMessageProps) => (
  <div className="flex flex-row justify-center items-center px-2 rounded-[12px] bg-stone-700 font-semibold">
    <AiFillWarning className="mt-1 mr-2 text-red-500" />
    <p className="text-red-500">{message}</p>
    <button className="mb-1 ml-2 text-[30px] text-white hover:text-red-500" onClick={dismiss}>
      &times;
    </button>
  </div>
);
