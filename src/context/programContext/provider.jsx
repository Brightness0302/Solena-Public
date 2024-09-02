import { useState } from "react";
import { ProgramContext } from "./context";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { AnchorProvider, Program } from "@project-serum/anchor";

import IDL from "../../utils/idl.json";
import { mintAddress, smartContractAddress } from "../../utils/resource";

const ProgramProvider = ({ children }) => {
  const { connection } = useConnection();
  const adapterWalletObj = useWallet();
  const { publicKey } = useWallet();
  const [balanceState, setBalanceState] = useState({
    solAmount: 0,
    tokenAmount: 0,
  });
  const [adminInformationState, setAdminInformationState] = useState({
    adminPDA: "",

    startSlotTimeStamp: 0,
    stakingTokenAddress: "",
    totalStakedAmount: 0.0,
    totalRewardedAmount: 0.0,
    totalHolders: 0,
  });
  const [userInformationState, setUserInformationState] = useState({
    userPDA: "",

    totalUserStakedAmount: 0.0,
    totalUserRewardedAmount: 0.0,
    stakedTimeStamp: 0,
    stakingCount: 0,
    stakingSeeds: [],
  });

  const getTokenBalance = async (tokenAddressString) => {
    try {
      if (!publicKey) return 0;

      const tokenAddress = new PublicKey(tokenAddressString);
      const ata = getAssociatedTokenAddressSync(tokenAddress, publicKey);
      const tokenAccountInfo = await connection.getParsedAccountInfo(ata);
      if (!tokenAccountInfo.value) {
        return 0;
      }
      const tokenBalance =
        tokenAccountInfo.value.data.parsed.info.tokenAmount.amount;

      return tokenBalance;
    } catch (err) {
      console.log(err);
      return 0;
    }
  };

  const getBalance = async () => {
    try {
      if (!publicKey) return 0;

      const accountInfo = await connection.getAccountInfo(publicKey);
      const balance = accountInfo.lamports;

      return balance;
    } catch (err) {
      return 0;
    }
  };

  const updateInformation = async () => {
    const balance = await getBalance();
    const tokenBalance = await getTokenBalance(mintAddress);

    setBalanceState({ solAmount: balance, tokenAmount: tokenBalance });

    const user = publicKey;
    const programID = new PublicKey(smartContractAddress);
    const mintToken = new PublicKey(mintAddress);

    const [temp_adminPDA] = PublicKey.findProgramAddressSync(
      [TOKEN_PROGRAM_ID.toBuffer(), Buffer.from("solena_staking")],
      programID
    );

    const fetchAdminPDA = async () => {
      if (temp_adminPDA === "" || !temp_adminPDA) return;

      try {
        const adminPDA_PublickKey = new PublicKey(temp_adminPDA);

        const MockWallet = {
          signTransaction: () => Promise.reject(),
          signAllTransactions: () => Promise.reject(),
          publicKey: Keypair.generate().publicKey,
        };

        const anchorProvider = new AnchorProvider(
          connection,
          MockWallet,
          "processed"
        );
        const program = new Program(IDL, programID, anchorProvider);
        const data = await program.account.adminInfo.fetch(adminPDA_PublickKey);

        const milliseconds = await connection.getBlockTime(
          parseInt(data.startSlot)
        );
        const startSlotTimeStamp = milliseconds * 1000;

        setAdminInformationState({
          adminPDA: temp_adminPDA,

          startSlotTimeStamp: startSlotTimeStamp,
          stakingTokenAddress: data.stakingToken.toString(),
          totalStakedAmount: parseFloat(data.totalStakedAmount.toString()),
          totalRewardedAmount: parseFloat(data.totalRewardedAmount.toString()),
          totalHolders: parseInt(data.totalHolders.toString()),
        });
      } catch (err) {
        setAdminInformationState({
          adminPDA: "",

          startSlotTimeStamp: 0,
          stakingTokenAddress: "",
          totalStakedAmount: 0.0,
          totalRewardedAmount: 0.0,
          totalHolders: 0,
        });
      }
    };

    await fetchAdminPDA();

    if (!publicKey) {
      setUserInformationState({
        userPDA: "",

        totalUserStakedAmount: 0.0,
        totalUserRewardedAmount: 0.0,
        stakedTimeStamp: 0,
        stakingCount: 0,
        stakingSeeds: [],
      });
      return;
    }

    const [temp_userPDA] = PublicKey.findProgramAddressSync(
      [user.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintToken.toBuffer()],
      programID
    );

    const fetchUserPDA = async () => {
      if (temp_userPDA === "" || !temp_userPDA) return;

      try {
        setUserInformationState({
          ...userInformationState,
          userPDA: temp_userPDA,
        });

        const userPDA_PublickKey = new PublicKey(temp_userPDA);

        const anchorProvider = new AnchorProvider(
          connection,
          adapterWalletObj,
          "processed"
        );

        const program = new Program(IDL, programID, anchorProvider);

        const data = await program.account.userInfo.fetch(userPDA_PublickKey);

        const milliseconds = await connection.getBlockTime(
          parseInt(data.depositSlot)
        );
        const stakedTimeStamp = milliseconds * 1000;
        const stakingSeeds = data.stakingSeeds.map((seed, index) =>
          seed.toString()
        );

        setUserInformationState({
          userPDA: temp_userPDA,

          totalUserStakedAmount: parseFloat(data.totalStakedAmount.toString()),
          totalUserRewardedAmount: parseFloat(
            data.totalRewardedAmount.toString()
          ),
          stakingCount: parseInt(data.stakingCount.toString()),
          stakingSeeds: stakingSeeds,
          stakedTimeStamp: stakedTimeStamp,
        });
      } catch (err) {
        setUserInformationState({
          userPDA: "",

          totalUserStakedAmount: 0.0,
          totalUserRewardedAmount: 0.0,
          stakedTimeStamp: 0,
          stakingCount: 0,
          stakingSeeds: [],
        });
      }
    };

    await fetchUserPDA();
  };

  return (
    <ProgramContext.Provider
      value={[
        balanceState,
        adminInformationState,
        userInformationState,
        updateInformation,
      ]}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export default ProgramProvider;
