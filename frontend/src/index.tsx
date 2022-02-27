import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { ContractProvider } from "@/context";
import { Dapp } from "@/components/DappV2";
import "@/css/index.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.



ReactDOM.render(
    <ContractProvider>
      <Router>
        <Dapp />    
      </Router>      
    </ContractProvider>,
  document.getElementById("root")
);
