import React, { useCallback, useContext, useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  formatLargeNumber,
  formatTimestamp,
  mintAddress,
  smartContractAddress,
} from "../utils/resource";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import IDL from "../utils/idl.json";
import { ProgramContext } from "../context/programContext/context";
import { toastNotify } from "../utils/toast";
import loadingForever from "../context/loadingContext/Images/loading-forever.gif";

export default function HarvestContainer({ seed, type }) {
  const adapterWalletObj = useWallet();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [pendingTimeStamp, setPendingTimeStamp] = useState(-2);
  const [amount, setAmount] = useState(0);
  const [depositSlotTimeStamp, setDepositSlotTimeStamp] = useState(0);
  const [withdrawSlotTimeStamp, setWithdrawSlotTimeStamp] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rewardDebt, setRewardDebt] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [status, setStatus] = useState(true);

  const [, adminInformationState, userInformationState, updateInformation] =
    useContext(ProgramContext);

  useEffect(() => {
    const interv = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(interv);
    };
  }, []);

  useEffect(() => {
    const fetchUserChildInfo = async () => {
      const programID = new PublicKey(smartContractAddress);
      const mintToken = new PublicKey(mintAddress);
      const [userChildInfoPDA] = PublicKey.findProgramAddressSync(
        [
          publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintToken.toBuffer(),
          new BN(seed).toArrayLike(Buffer, "le", 2),
        ],
        programID
      );

      const anchorProvider = new AnchorProvider(
        connection,
        adapterWalletObj,
        "processed"
      );

      const program = new Program(IDL, programID, anchorProvider);
      const data = await program.account.userChildInfo.fetch(userChildInfoPDA);

      const amount = parseInt(data.amount.toString());
      const deposit_milliseconds = await connection.getBlockTime(
        parseInt(data.depositSlot)
      );
      const depositSlotTimeStamp = deposit_milliseconds * 1000;
      const withdraw_milliseconds = await connection.getBlockTime(
        parseInt(data.withdrawSlot)
      );
      const withdrawSlotTimeStamp = withdraw_milliseconds * 1000;
      const duration = parseInt(data.duration.toString());
      const rewardDebt = parseInt(data.rewardDebt.toString());

      setAmount(amount);
      setDepositSlotTimeStamp(depositSlotTimeStamp);
      setWithdrawSlotTimeStamp(withdrawSlotTimeStamp);
      setDuration(duration);
      setRewardDebt(rewardDebt);
      setStatus(false);
    };
    if (!seed || seed == 0 || !publicKey) return;
    fetchUserChildInfo();
  }, [publicKey, seed, userInformationState]);

  useEffect(() => {
    if (!publicKey) return;
    if (depositSlotTimeStamp === 0) return;
    const stakedTime = new Date(depositSlotTimeStamp);
    const stakedDuration = duration;
    const endTime = stakedTime;
    endTime.setMonth(stakedTime.getMonth() + stakedDuration);
    setPendingTimeStamp(endTime.getTime());
  }, [depositSlotTimeStamp, duration]);

  const RewardSolena = async () => {
    if (amount === 0 || rewardDebt !== 0) {
      toastNotify("warning", "You should stake before claiming!");
      return;
    }

    // if (pendingTimeStamp > currentTime) {
    //   toastNotify("warning", "Your funds is staking now.");
    //   return;
    // }

    const adminPDA = adminInformationState.adminPDA;
    const userPDA = userInformationState.userPDA;

    if (adminPDA === "" || userPDA === "") {
      toastNotify("error", "Not Connected!");
      return;
    }

    setStatus(true);
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

      const [userChildInfoPDA] = PublicKey.findProgramAddressSync(
        [
          publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintToken.toBuffer(),
          new BN(seed).toArrayLike(Buffer, "le", 2),
        ],
        programID
      );
      const userChildInfoPDA_PublicKey = new PublicKey(userChildInfoPDA);

      const tx = await program.methods
        .claimReward(new BN(seed))
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
      console.log(tx);
      toastNotify("success", "Claim Success!");
      updateInformation();
    } catch (error) {
      toastNotify("error", "Claim Failed!");
    }
    setStatus(false);
  };

  const UnstakeSolena = async () => {
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
      .unstake()
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

    updateInformation();
  };

  const differenceDays = () => {
    const timeNow = Date.now();
    if (
      !publicKey ||
      !adminInformationState.adminPDA ||
      !userInformationState.userPDA ||
      userInformationState.userStakedAmount === 0
    ) {
      return (
        <>
          <p className="text-4xl font-bold">No Claim!</p>
        </>
      );
    }
    if (timeNow >= pendingTimeStamp) {
      return (
        <>
          <p className="text-4xl font-bold">Claim Now!</p>
        </>
      );
    }
    const differenceTimeStamp = pendingTimeStamp - timeNow;
    if (differenceTimeStamp >= 1000 * 60 * 60 * 24 * 365) {
      return (
        <>
          <p className="text-3xl font-bold">Few Yrs</p>
          <span className="text-sm">remained for reward</span>
        </>
      );
    }
    if (differenceTimeStamp >= 1000 * 60 * 60 * 24 * 31) {
      return (
        <>
          <p className="text-3xl font-bold">Few Mths</p>
          <span className="text-sm">remained for reward</span>
        </>
      );
    }
    if (differenceTimeStamp >= 1000 * 60 * 60 * 24) {
      return (
        <>
          <p className="text-3xl font-bold">Few Days</p>
          <span className="text-sm">remained for reward</span>
        </>
      );
    }
    if (differenceTimeStamp >= 1000 * 60 * 60) {
      return (
        <>
          <p className="text-3xl font-bold">Few Hrs</p>
          <span className="text-sm">remained for reward</span>
        </>
      );
    }
    if (differenceTimeStamp >= 1000 * 60) {
      return (
        <>
          <p className="text-3xl font-bold">Few Mins</p>
          <span className="text-sm">remained for reward</span>
        </>
      );
    }
    if (differenceTimeStamp >= 1000) {
      return (
        <>
          <p className="text-3xl font-bold">Few Secs</p>
          <span className="text-sm">remained for reward</span>
        </>
      );
    }
    return (
      <>
        <p className="text-3xl font-bold">A sec</p>
        <span className="text-sm">remained for reward</span>
      </>
    );
  };

  const claimName = useCallback(() => {
    if (!publicKey) return "Not Connected";
    if (amount === 0) return "No Claim";
    const nowTimeStamp = currentTime;
    if (rewardDebt !== 0) return "Claim";
    const difference = pendingTimeStamp - nowTimeStamp;
    const days = Math.floor(difference / 24 / 60 / 60 / 1000);
    const hours = Math.floor(difference / 60 / 60 / 1000) % 24;
    const minutes = Math.floor(difference / 60 / 1000) % 60;
    const seconds = Math.floor(difference / 1000) % 60;
    return `${days} Days ${hours} HRs ${minutes} MINs ${seconds} SECs`;
  }, [pendingTimeStamp, currentTime]);

  const claimNameForEnded = useCallback(() => {
    if (!publicKey) return "Not Connected";
    if (amount === 0) return "No Claim";
    const nowTimeStamp = currentTime;
    if (rewardDebt === 0) return "Claim";
    const difference = nowTimeStamp - pendingTimeStamp;
    const days = Math.floor(difference / 24 / 60 / 60 / 1000);
    const hours = Math.floor(difference / 60 / 60 / 1000) % 24;
    const minutes = Math.floor(difference / 60 / 1000) % 60;
    const seconds = Math.floor(difference / 1000) % 60;
    return `${days} Days ${hours} HRs ${minutes} MINs ${seconds} SECs`;
  }, [pendingTimeStamp, currentTime]);

  if (!type && rewardDebt === 0) return;
  if (type && rewardDebt !== 0) return;

  if (!type && rewardDebt > 0) {
    return (
      <div className="relative flex justify-center">
        <div className="harvest-container w-[360px] h-[330px]">
          {status && (
            <div className="backdrop-blur-sm absolute w-full h-full">
              <img
                src={loadingForever}
                className="absolute w-24 h-24 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                alt="Loading..."
              />
            </div>
          )}
          <div className="border-2 border-[#ECFDFF20] bg-[#ECFDFF07] rounded-3xl p-5 flex flex-col justify-between gap-5">
            <div className="flex flex-row items-center gap-3">
              <p className="text-2xl">Completed REWARD</p>
            </div>
            <div className="flex flex-row justify-start gap-3 items-end">
              <p className="text-3xl font-bold">Congratulations!</p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-1">
                  <p className="text-[#7979AC] text-sm font-medium">
                    Staked timestamp
                  </p>
                  <p>{formatTimestamp(depositSlotTimeStamp)}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[#7979AC] text-sm font-medium">
                    Withdraw timestamp
                  </p>
                  <p>{formatTimestamp(withdrawSlotTimeStamp)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-1">
                  <p className="text-[#7979AC] text-sm font-medium">
                    Deposit Solena
                  </p>
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      className="w-[17px] h-[15px]"
                      src="/images/feature/deposit.png"
                      alt=""
                    />
                    <p>{formatLargeNumber(amount / 1e6)}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[#7979AC] text-sm font-medium">
                    Reward Solena
                  </p>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="flex justify-center items-center rounded-full bg-[#262F4B] w-[18px] h-[18px]">
                      <img className="" src="/images/icons/solana.png" alt="" />
                    </div>
                    <p>{formatLargeNumber(rewardDebt / 1e6)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-5">
              <button
                className={`typeDeactive flex-grow rounded-full px-4 py-2 text-xs font-semibold`}
              >
                {claimNameForEnded()}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center">
      <div className="harvest-container relative w-[360px] h-[330px]">
        {status && (
          <div className="backdrop-blur-sm absolute w-full h-full">
            <img
              src={loadingForever}
              className="absolute w-24 h-24 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
              alt="Loading..."
            />
          </div>
        )}
        <div className="border-2 border-[#ECFDFF20] bg-[#ECFDFF07] rounded-3xl p-5 flex flex-col justify-between gap-5">
          <div className="flex flex-row items-center gap-3">
            <p className="text-2xl">
              {pendingTimeStamp - currentTime <= 0
                ? "REWARD"
                : "PENDING REWARD"}
            </p>
          </div>
          <div className="flex flex-row justify-start gap-3 items-end">
            {differenceDays()}
          </div>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-sm font-medium">
                  Staked timestamp
                </p>
                <p>{formatTimestamp(depositSlotTimeStamp)}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-sm font-medium">
                  Staked Duration
                </p>
                <p>
                  {duration} {duration === 1 ? "Month" : "Months"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-sm font-medium">
                  Your Deposits
                </p>
                <div className="flex flex-row gap-2 items-center">
                  <img
                    className="w-[17px] h-[15px]"
                    src="/images/feature/deposit.png"
                    alt=""
                  />
                  <p>{formatLargeNumber(amount / 1e6)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[#7979AC] text-sm font-medium">
                  Claim Solena
                </p>
                <div className="flex flex-row gap-2 items-center">
                  <div className="flex justify-center items-center rounded-full bg-[#262F4B] w-[18px] h-[18px]">
                    <img className="" src="/images/icons/solana.png" alt="" />
                  </div>
                  <p>
                    {formatLargeNumber(
                      (amount * Math.pow(1 + 0.05 / 12, duration)) / 1e6
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-5">
            <button
              className={`${
                pendingTimeStamp - currentTime <= 0
                  ? "typeActive"
                  : "typeDeactive"
              } flex-grow rounded-full px-4 py-2 text-xs font-semibold`}
              onClick={() => RewardSolena()}
            >
              {claimName()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
