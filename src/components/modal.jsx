import React, { useContext, useEffect, useRef, useState } from "react";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import { toastNotify } from "../utils/toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import IDL from "../utils/idl.json";
import { ProgramContext } from "../context/programContext/context";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LABELS,
  generateSeed,
  mintAddress,
  smartContractAddress,
  stage1,
} from "../utils/resource";

export default function Modal({ showModal, setShowModal }) {
  const container = useRef(null);
  const [duration, setDuration] = useState(4);
  const durationRange = [0, 1, 3, 6, 12, 24, 36];
  const [stakingTokenAmount, setStakingTokenAmount] = useState(0.0);
  const [hideModal, setHideModal] = useState(false);
  const navigate = useNavigate();

  const adapterWalletObj = useWallet();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [
    balanceState,
    adminInformationState,
    userInformationState,
    updateInformation,
  ] = useContext(ProgramContext);

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
      navigate("/stake");
      setTimeout(() => {
        setModalStatus();
      }, 300);
    }
  };

  const StakeSolena = async () => {
    const adminPDA = adminInformationState.adminPDA;
    const userPDA = userInformationState.userPDA;
    const ownSolAmount = balanceState.solAmount;
    const ownTokenAmount = balanceState.tokenAmount;

    if (adminPDA === "" || userPDA === "") {
      toastNotify("error", "Not Connected!");
      return;
    }

    if (stakingTokenAmount <= 0) {
      toastNotify("warning", "Increase Staking Amount");
      return;
    }

    if (ownSolAmount === 0) {
      toastNotify("warning", "You have no enough SOL on your wallet.");
      return;
    }

    if (ownTokenAmount <= stakingTokenAmount * 1e6) {
      toastNotify("warning", "You have no enough Solena on your wallet.");
      return;
    }

    if (durationRange[duration] <= 0) {
      toastNotify("warning", "Change your staking duration!");
      return;
    }

    try {
      const programID = new PublicKey(smartContractAddress);
      const mintToken = new PublicKey(mintAddress);
      const adminPDA_PublicKey = new PublicKey(adminPDA);
      const userPDA_PublicKey = new PublicKey(userPDA);

      const anchorProvider = new AnchorProvider(
        connection,
        adapterWalletObj,
        "processed"
      );

      const program = new Program(IDL, programID, anchorProvider);

      const adminTokenAccount = await getAssociatedTokenAddress(
        mintToken,
        adminPDA_PublicKey,
        true
      );

      const userTokenAccount = await getAssociatedTokenAddress(
        mintToken,
        publicKey
      );

      const pda_seed = generateSeed();
      const [userChildInfoPDA] = PublicKey.findProgramAddressSync(
        [
          publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintToken.toBuffer(),
          new BN(pda_seed).toArrayLike(Buffer, "le", 2),
        ],
        programID
      );
      const userChildInfoPDA_PublicKey = new PublicKey(userChildInfoPDA);

      try {
        const data = await program.account.userInfo.fetch(userPDA);

        try {
          const tx = await program.methods
            .stakeUserChildInfo(
              new BN(pda_seed),
              new BN(stakingTokenAmount * 1e6),
              new BN(durationRange[duration])
            )
            .accounts({
              user: publicKey,
              adminPda: adminPDA_PublicKey,
              userInfo: userPDA_PublicKey,
              userChildInfo: userChildInfoPDA_PublicKey,
              userStakingWallet: userTokenAccount,
              adminStakingWallet: adminTokenAccount,
              stakingToken: mintToken,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            })
            .signers([])
            .rpc();
          console.log("staked:", tx);
          toastNotify("success", "Stake Completed!");
        } catch (error) {
          console.log(error);
          toastNotify("error", "Stake Failed!");
          return;
        }
      } catch (error) {
        try {
          const tx = await program.methods
            .initializeUserInfo(
              new BN(pda_seed),
              new BN(stakingTokenAmount * 1e6),
              new BN(durationRange[duration])
            )
            .accounts({
              user: publicKey,
              adminPda: adminPDA_PublicKey,
              userInfo: userPDA_PublicKey,
              userChildInfo: userChildInfoPDA_PublicKey,
              userStakingWallet: userTokenAccount,
              adminStakingWallet: adminTokenAccount,
              stakingToken: mintToken,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            })
            .signers([])
            .rpc();
          console.log("staked", tx);
          toastNotify("success", "Stake Completed!");
        } catch (error) {
          console.log(error);
          toastNotify("error", "Stake Failed!");
          return;
        }
      }
      {
        setHideModal(true);
        navigate("/stake");
        setTimeout(() => {
          setModalStatus();
        }, 300);
      }
      updateInformation();
    } catch (error) {
      console.log(error);
      toastNotify("error", "Stake Failed!");
    }
  };

  const updateSolAmount = (e) => {
    const val = e.target.value;
    if (!val) {
      setStakingTokenAmount(0);
    }
    setStakingTokenAmount(val);
  };

  return (
    <div
      onClick={handler}
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 ${
        showModal || hideModal ? "visible" : "invisible"
      }`}
    >
      <div
        className={`fixed top-0 left-0 w-full h-full backdrop-blur-xl ${
          showModal ? "ReactModal__Overlay--after-open" : "ReactModal__Overlay"
        } ${hideModal ? "ReactModal__Overlay--before-close" : ""}`}
      ></div>
      <div
        ref={container}
        className={`z-10 flex flex-col items-center bg-[#1B1B36] border-2 border-[#ECFDFF10] w-[620px] rounded-[34px] px-12 py-8 gap-5 modal ${
          showModal ? "ReactModal__Overlay--after-open" : "ReactModal__Overlay"
        } ${hideModal ? "ReactModal__Overlay--before-close" : ""}`}
      >
        <div className="flex flex-row justify-center items-center gap-3 w-full">
          <div className="flex justify-center items-center rounded-full bg-[#262F4B] w-[24px] h-[24px]">
            <img className="h-[11px]" src="/images/icons/solana.png" alt="" />
          </div>
          <p className="text-2xl">SOL</p>
        </div>
        <p className="text-5xl font-bold">Stake</p>
        <div className="w-full">
          <div className="flex flex-row justify-between items-center mb-1">
            <p className="text-base font-medium">Amount</p>
            <p className="text-sm font-semibold more-text">Enter Forms</p>
          </div>
          <div className="relative z-0 w-full">
            <input
              type="text"
              name="duration"
              placeholder="0.3"
              value={stakingTokenAmount}
              onChange={(e) => updateSolAmount(e)}
              className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 pl-5 bg-[#15152B] border border-[#15152B] appearance-none rounded-full focus:ring-0 focus:outline-none"
            />
            <div className="absolute top-0 right-0 mt-3 mr-4 pointer-events-none">
              SOLENA
            </div>
            <span className="text-sm text-red-600 hidden" id="error">
              SOLENA is required
            </span>
          </div>
          <div className="relative z-0 w-full mb-3">
            <input
              type="text"
              name="duration"
              value={(stakingTokenAmount * stage1).toFixed(9)}
              className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 pl-5 bg-transparent border border-[#7979AC] text-gray-400 appearance-none rounded-full focus:ring-0 focus:outline-none"
              disabled
            />
            <div className="absolute top-0 right-0 mt-3 mr-4 text-gray-400 pointer-events-none">
              USD
            </div>
            <span className="text-sm text-red-600 hidden" id="error">
              USD is required
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <p className="font-semibold text-[#7979AC]">Network Fee</p>
            <p>
              <span className="font-semibold">0.0051172785 SOL</span>{" "}
              <span className="text-[#7979AC]">(0.0002 USD)</span>
            </p>
          </div>
          <div className="flex justify-between text-[13px]">
            <p className="font-semibold text-[#7979AC]">Validator</p>
            <p>
              <span className="font-semibold">AtomicWallet -7%</span>{" "}
              <span className="text-[#7979AC]">yearly yield</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <p className="font-medium text-base">Duration</p>
          <div className="relative flex flex-col mx-2">
            <span
              className={`bg-white rounded-lg w-[100px] h-6 mt-1 mb-5 absolute transform -translate-x-1/2 flex justify-center items-center durationBackground`}
              style={{
                left: `calc(${(100 / 6) * duration}% + ${
                  Number(duration) === 0
                    ? 30
                    : Number(duration) === Number(durationRange.length - 1)
                    ? -30
                    : 0
                }px)`,
              }}
            >
              <span className="text-black text-center text-xs font-bold">
                {durationRange[duration]} Month
              </span>
            </span>
            <span
              className="range-slider-selection h-2 z-10 absolute left-0 top-12 rounded-full pointer-events-none"
              style={{ width: `${(100 / 6) * duration}%` }}
            ></span>
            <input
              id="medium-range"
              type="range"
              value={duration}
              step={1}
              min={0}
              max={6}
              onChange={(e) => {
                setDuration(e.target.value);
              }}
              className="mt-12 h-2 bg-[#15152B] rounded-lg appearance-none cursor-pointer range-slider [-webkit-appearance:none] [&::-webkit-slider-runnable-track]:h-full [&::-moz-range-track]:h-full [&::-webkit-slider-runnable-track]:rounded-full [&::-moz-range-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-blue-gray-100 [&::-moz-range-track]:bg-blue-gray-100 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:[-webkit-appearance:none] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:[-webkit-appearance:none] [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-2 [&::-moz-range-thumb]:ring-current [&::-webkit-slider-thumb]:ring-current [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:relative [&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:z-20 [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:w-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-moz-range-thumb]:-mt-[3px] [&::-webkit-slider-thumb]:-mt-[3px]"
            ></input>
          </div>
          <div className="flex flex-row justify-between text-[#7979AC] font-medium text-xs">
            {durationRange.map((value, index) => {
              return (
                <p key={index} className="w-[24px] text-center">
                  {value}
                </p>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col w-full gap-3 sm:gap-0">
          <p className="font-medium text-base mb-1">Estimated Stake Rewards</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex flex-row sm:flex-col justify-center items-start text-[13px]">
              <p className="font-semibold more-text w-[100px] sm:w-fit">
                Daily
              </p>
              <div className="flex flex-col justify-center items-start">
                <p className="font-semibold text-[14px]">
                  {(((1 + 0.05 / 12) ** 1 * stakingTokenAmount) / 30.0).toFixed(
                    4
                  )}{" "}
                  Solena
                </p>
                <p className="text-[#7979AC]">
                  (
                  {(
                    (((1 + 0.05 / 12) ** 1 * stakingTokenAmount) / 30.0) *
                    stage1
                  ).toFixed(4)}{" "}
                  USD)
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col justify-center items-start text-[13px]">
              <p className="font-semibold more-text w-[100px] sm:w-fit">
                Monthly
              </p>
              <div className="flex flex-col justify-center items-start">
                <p className="font-semibold text-[14px]">
                  {((1 + 0.05 / 12) ** 1 * stakingTokenAmount).toFixed(4)}{" "}
                  Solena
                </p>
                <p className="text-[#7979AC]">
                  (
                  {((1 + 0.05 / 12) ** 1 * stakingTokenAmount * stage1).toFixed(
                    4
                  )}{" "}
                  USD)
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col justify-center items-start text-[13px]">
              <p className="font-semibold more-text w-[100px] sm:w-fit">
                Yearly
              </p>
              <div className="flex flex-col justify-center items-start">
                <p className="font-semibold text-[14px]">
                  {((1 + 0.05 / 12) ** 12 * stakingTokenAmount).toFixed(4)}{" "}
                  Solena
                </p>
                <p className="text-[#7979AC]">
                  (
                  {(
                    (1 + 0.05 / 12) ** 12 *
                    stakingTokenAmount *
                    stage1
                  ).toFixed(4)}{" "}
                  USD)
                </p>
              </div>
            </div>
          </div>
        </div>
        {!publicKey ? (
          <BaseWalletMultiButton
            style={{
              width: "100%",
              height: "50px",
              color: "rgb(27 27 54 / 1)",
              fontWeight: "600",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textAlign: "center",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
            }}
            labels={LABELS}
          />
        ) : (
          <button
            className="stakebutton text-black rounded-full text-sm font-semibold w-full p-3"
            onClick={() => StakeSolena()}
          >
            Stake
          </button>
        )}
      </div>
    </div>
  );
}
