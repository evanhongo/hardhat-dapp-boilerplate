import React from "react";
import ReactDOM from "react-dom";
// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

import { ContractProvider } from "./context";
import contractAddress from "./contracts/contract-address.json";
import contractArtifacts from "./contracts/contract-artifacts.json";
import { Dapp } from "./components/DappV2";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

const contractInfo = {
  address: contractAddress.address,
  abi: contractArtifacts.abi
}

ReactDOM.render(
  <React.StrictMode>
    <ContractProvider contractInfo={contractInfo}>
      <Dapp />    
    </ContractProvider>    
  </React.StrictMode>,
  document.getElementById("root")
);
