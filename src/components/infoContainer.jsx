import React, { useCallback, useContext, useEffect, useState } from "react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import IDL from "../utils/idl.json";
import { formatLargeNumber, smartContractAddress } from "../utils/resource";
import { ProgramContext } from "../context/programContext/context";
import { toastNotify } from "../utils/toast";

export default function InfoContainer({ selectInfoContainer, mintAddress }) {
  const adapterWalletObj = useWallet();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [, adminInformationState, userInformationState, updateInformation] =
    useContext(ProgramContext);

  const [pendingTimeStamp, setPendingTimeStamp] = useState(-2);

  useEffect(() => {
    if (!publicKey) return;
    if (userInformationState.userStakedAmount === 0) return;
    const stakedTime = new Date(userInformationState.stakedTimeStamp);
    const stakedDuration = userInformationState.stakedDuration;
    const endTime = stakedTime;
    endTime.setMonth(stakedTime.getMonth() + stakedDuration);
    setPendingTimeStamp(endTime.getTime());
  }, [userInformationState]);

  const RewardSolena = async () => {
    if (userInformationState.userStakedAmount === 0) {
      toastNotify("warning", "You should stake before claiming!");
      return;
    }

    const adminPDA = adminInformationState.adminPDA;
    const userPDA = userInformationState.userPDA;

    if (adminPDA === "" || userPDA === "") {
      toastNotify("error", "Not Connected!");
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

      const tx = await program.methods
        .claimReward()
        .accounts({
          user: publicKey,
          adminPda: adminPDA_PublicKey,
          userInfo: userPDA_PublicKey,
          userStakingWallet: userTokenAccount,
          adminStakingWallet: adminTokenAccount,
          stakingToken: mintToken,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();
      console.log(tx);
      toastNotify("success", "Claim Success!");
      updateInformation();
    } catch (error) {
      console.log(error);
      toastNotify("error", "Claim Failed!");
      return;
    }
  };

  useEffect(() => {
    const interv = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(interv);
    };
  }, []);

  return (
    <div className="relative">
      <div className="info-container">
        <button
          className="absolute top-0 right-0 rounded-tr-3xl rounded-bl-3xl p-5 text-sm font-semibold more-text bg-[#ECFDFF10] border-2 border-[#ECFDFF20]"
          onClick={() => selectInfoContainer()}
        >
          More
        </button>
        <div className="border-2 border-[#ECFDFF20] bg-[#ECFDFF07] rounded-3xl p-5 flex flex-col justify-between gap-5">
          <div className="flex flex-col justify-between gap-5">
            <div className="flex flex-row items-center gap-3">
              <div className="flex justify-center items-center rounded-full bg-[#262F4B] w-[24px] h-[24px]">
                <img
                  className="h-[11px]"
                  src="/images/icons/solana.png"
                  alt=""
                />
              </div>
              <p className="text-2xl">SOLENA</p>
            </div>
            <div className="flex flex-row justify-start gap-3 items-end">
              <p className="text-4xl font-bold">20%</p>
              <span className="text-sm">APR</span>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-sm font-medium">TVL</p>
                <p>${formatLargeNumber(0)}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-sm font-medium">
                  Total Solena
                </p>
                <p>
                  {formatLargeNumber(
                    adminInformationState.totalStakedAmount / 1e6
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-xs font-medium">
                  Your Total Deposits
                </p>
                <div className="flex flex-row gap-2 items-center">
                  <img
                    className="w-[17px] h-[15px]"
                    src="/images/feature/deposit.png"
                    alt=""
                  />
                  <p>
                    {formatLargeNumber(
                      userInformationState.totalUserStakedAmount / 1e6
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-xs font-medium">
                  Your Total Rewards
                </p>
                <div className="flex flex-row gap-2 items-center">
                  <div className="flex justify-center items-center rounded-full bg-[#262F4B] w-[18px] h-[18px]">
                    <img className="" src="/images/icons/solana.png" alt="" />
                  </div>
                  <p>
                    {formatLargeNumber(
                      userInformationState.totalUserRewardedAmount / 1e6
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* {userInformationState.userStakedAmount !== 0 && (
            <div className="flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#7979AC] text-sm font-medium">
                      Your Currency
                    </p>
                    <div className="flex flex-row gap-2 items-center">
                      <img
                        className="w-[17px] h-[15px]"
                        src="/images/feature/deposit.png"
                        alt=""
                      />
                      <p>
                        {formatLargeNumber(
                          userInformationState.userStakedAmount / 1e6
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#7979AC] text-sm font-medium">
                      Claim Solena
                    </p>
                    <div className="flex flex-row gap-2 items-center">
                      <div className="flex justify-center items-center rounded-full bg-[#262F4B] w-[18px] h-[18px]">
                        <img
                          className=""
                          src="/images/icons/solana.png"
                          alt=""
                        />
                      </div>
                      <p>
                        {formatLargeNumber(
                          (userInformationState.userStakedAmount *
                            Math.pow(
                              1 + 0.05 / 12,
                              userInformationState.stakedDuration
                            )) /
                            1e6
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <div className="flex flex-row justify-between gap-5">
            <button
              className={`stakebutton flex-grow rounded-full px-4 py-2 text-xs font-semibold`}
              onClick={() => selectInfoContainer()}
            >
              Stake
            </button>
            {/* {userInformationState.userStakedAmount !== 0 && (
              <button
                className={`typeDeactive text-white flex-grow rounded-full px-4 py-2 text-[10px] font-semibold`}
                onClick={() => RewardSolena()}
              >
                {claimName()}
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
