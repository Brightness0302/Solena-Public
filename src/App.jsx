import React, { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// page
import Layout from "./pages/layout";
import { Home } from "./pages/home";
import Stake from "./pages/stake";
import { ToastContainer } from "react-toastify";
// context
import LoadingProvider from "./context/loadingContext/provider";
import CustomWalletProvider from "./context/walletContext/provider";
//
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// styles
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import "react-toastify/dist/ReactToastify.css";
import ProgramProvider from "./context/programContext/provider";

const App = () => {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <LoadingProvider>
      <Context>
        <ProgramProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Layout />}>
                <Route exact index element={<Home />} />
                <Route
                  path="stake/sol"
                  element={downMd ? <Stake /> : <Home />}
                />
                <Route path="stake" element={<Home />} />
                <Route path="farm" element={<Home />} />
                <Route path="launchpad" element={<Home />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </ProgramProvider>
      </Context>
    </LoadingProvider>
  );
};

const Context = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint =
    "https://quiet-flashy-dream.solana-devnet.quiknode.pro/12ecf67b85c5f615f78ab0b3d68d636cf54f679b/";

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
