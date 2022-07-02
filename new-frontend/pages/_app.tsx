import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { wrapper } from "@/redux/store";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default wrapper.withRedux(MyApp);
