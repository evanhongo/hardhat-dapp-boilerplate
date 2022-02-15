import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { ContractProvider } from "@/context";
import contractAddress from "@/contracts/contract-address.json";
import contractArtifacts from "@/contracts/contract-artifacts.json";
import { Dapp } from "@/components/DappV2";
import "@/css/index.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

const contractInfo = {
  address: contractAddress.address,
  abi: contractArtifacts.abi
}

ReactDOM.render(
    <ContractProvider contractInfo={contractInfo}>
      <Router>
        <Dapp />    
      </Router>      
    </ContractProvider>,
  document.getElementById("root")
);
