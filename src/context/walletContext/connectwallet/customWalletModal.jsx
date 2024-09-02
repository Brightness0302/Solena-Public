import {
  WalletConnectionError,
  WalletNotReadyError,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useRef, useState } from "react";
import { toastNotify } from "../../../utils/toast";
import CloseButton from "../../../assets/components/closeButton";
import { toast } from "react-toastify";

export default function CustomWalletModal({ showModal, setShowModal }) {
  const container = useRef(null);
  const [hideModal, setHideModal] = useState(false);
  const {
    select,
    connect,
    connecting,
    connected,
    wallet,
    wallets,
    publicKey,
    disconnect,
  } = useWallet();
  const [hasComponentMounted, setHasComponentMounted] = useState(false);
  const [processing, setProcessing] = useState(-1);

  useEffect(() => {
    if (!hasComponentMounted) {
      setHasComponentMounted(true);
    }
  }, [hasComponentMounted]);

  useEffect(() => {
    if (!hasComponentMounted || !showModal) return;
    if (
      wallet &&
      (wallet.readyState === WalletReadyState.NotDetected ||
        wallet.readyState === WalletReadyState.Unsupported)
    ) {
      disconnect();
    }
  }, [hasComponentMounted, showModal]);

  useEffect(() => {
    if (!hasComponentMounted || !showModal) return;
    const connectwallet = async () => {
      try {
        await connect();
      } catch (err) {
        console.log("Error", err);
        if (err instanceof WalletNotReadyError) {
          toastNotify("warning", "Wallet Not Ready");
        } else if (err instanceof WalletConnectionError) {
          toastNotify("error", "Wallet Connection Error");
        }
      }
    };
    if (wallet && !publicKey) {
      connectwallet();
    }
  }, [wallet, publicKey, hasComponentMounted, showModal]);

  useEffect(() => {
    if (hasComponentMounted && showModal && connecting) {
      setProcessing(toastNotify("pending", "Wallet Connecting"));
    }
  }, [connecting, hasComponentMounted, showModal]);

  useEffect(() => {
    if (hasComponentMounted && showModal && connected && processing !== -1) {
      toast.dismiss(processing);
      setProcessing(-1);
      toastNotify("success", "Wallet Connected!");

      setHideModal(true);
      setTimeout(() => {
        setModalStatus();
      }, 300);
    }
  }, [connected, hasComponentMounted, showModal, processing, setProcessing]);

  useEffect(() => {
    if (showModal || hideModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal, hideModal]);

  const setModalStatus = () => {
    setShowModal(false);
    setHideModal(false);
  };

  const handler = (event) => {
    if (!container.current) {
      return;
    }
    // if click was not inside of the element. "!" means not
    // in other words, if click is outside the modal element
    if (showModal && !container.current.contains(event.target)) {
      setHideModal(true);
      setTimeout(() => {
        setModalStatus();
      }, 300);
    }
  };

  return (
    <div
      onClick={handler}
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 ${
        showModal || hideModal ? "visible" : "invisible"
      }`}
    >
      <div
        className={`fixed top-0 left-0 w-full h-full backdrop-blur-md ${
          showModal ? "ReactModal__Overlay--after-open" : "ReactModal__Overlay"
        } ${hideModal ? "ReactModal__Overlay--before-close" : ""}`}
      ></div>
      <div
        ref={container}
        className={`z-10 flex flex-col bg-[#1B1B36] border-2 border-[#ECFDFF10] rounded-[34px] px-12 py-8 gap-5 modal ${
          showModal ? "ReactModal__Overlay--after-open" : "ReactModal__Overlay"
        } ${hideModal ? "ReactModal__Overlay--before-close" : ""}`}
      >
        <div className="flex justify-end items-end">
          <CloseButton
            className={"cursor-pointer"}
            onClick={() => setShowModal(false)}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-3 w-full">
          <p className="text-2xl md:text-[50px] text-white font-bold">
            Connect Wallet
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-3">
          {wallets.filter((wallet) => wallet.readyState === "Installed")
            .length > 0 ? (
            wallets.map((wallet) => (
              <div
                key={wallet.adapter.name}
                onClick={() => {
                  if (hasComponentMounted && showModal && !connected) {
                    select(wallet.adapter.name);
                  }
                }}
                className="flex flex-col justify-center items-center gap-2 cursor-pointer w-[160px] h-[130px] border rounded-2xl border-[#7979AC] hover:bg-[#1C3C6336]"
              >
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-[30px] h-[30px]"
                />
                <p className="text-center text-white">{wallet.adapter.name}</p>
                <span className="text-white text-xs px-3 py-1 bg-gray-800 rounded-full">
                  {wallet.readyState}
                </span>
              </div>
            ))
          ) : (
            <p>No wallet found. Please download a supported Solana wallet</p>
          )}
        </div>
      </div>
    </div>
  );
}
