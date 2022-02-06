import { FC } from "react";

interface NetworkErrorMessageProps {
  message: string;
  dismiss?: () => void;
}

export const NetworkErrorMessage: FC<NetworkErrorMessageProps> = ({ message, dismiss }) => (
  <div className="alert alert-danger" role="alert">
    {message}
    <button
      type="button"
      className="close"
      data-dismiss="alert"
      aria-label="Close"
      onClick={dismiss}
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);
