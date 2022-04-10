import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { EtherProvider } from "@/context";
import { Dapp } from "@/DappV2";
import "@/css/index.css";

ReactDOM.render(
  <EtherProvider>
    <Router>
      <Dapp />
    </Router>
  </EtherProvider>,
  document.getElementById("root")
);
