import React, { useContext, useEffect, useState } from "react";
import { CustomWalletContext } from "../context";
import { useWallet } from "@solana/wallet-adapter-react";
import { toastNotify } from "../../../utils/toast";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function CustomWalletButton() {
  const [walletModalState, setWalletModalState] =
    useContext(CustomWalletContext);
  const {
    select,
    connect,
    connecting,
    connected,
    disconnecting,
    wallet,
    wallets,
    publicKey,
    disconnect,
  } = useWallet();
  const [buttonLabel, setButtonLabel] = useState("Connect Wallet");

  useEffect(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      setButtonLabel(base58.slice(0, 4) + ".." + base58.slice(-4));
    }
  }, [publicKey]);

  // useEffect(() => {
  //   if (connecting) {
  //     console.log(wallet.adapter.connecting, wallet.adapter.connected);
  //     setButtonLabel("Connecting...");
  //   }
  // }, [connecting, wallet]);

  return (
    <>
      <button
        className="btn-main"
        style={{
          color: "rgb(27 27 54 / 1)",
          fontWeight: "600",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          textAlign: "center",
          paddingTop: "13px",
          paddingBottom: "13px",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderRadius: "20px",
        }}
        onClick={async () => {
          if (!publicKey && !walletModalState) {
            await disconnect();
            setWalletModalState(true);
          } else {
            disconnect();
            setButtonLabel("Connect Wallet");
            toastNotify("info", "Wallet Disconnected!");
          }
        }}
      >
        {buttonLabel}
      </button>
    </>
  );
}
