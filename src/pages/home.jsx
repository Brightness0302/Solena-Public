import { useEffect, useState } from "react";
import Modal from "../components/modal";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import IDL from "../utils/idl.json";
import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import FixedStakingComponent from "../components/fixedstakingContainer";
import HarvestGroupContainer from "../components/harvestgroupContainer";
import { mintAddress, smartContractAddress } from "../utils/resource";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const adapterWalletObj = useWallet();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const stakeFeature = async () => {
    if (!publicKey) {
      console.log("No wallet");
      return;
    }
    const programID = new PublicKey(smartContractAddress);
    const mintToken = new PublicKey(mintAddress);

    const [adminPDA] = PublicKey.findProgramAddressSync(
      [TOKEN_PROGRAM_ID.toBuffer(), Buffer.from("solena_staking")],
      programID
    );

    const [userPDA] = PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintToken.toBuffer()],
      programID
    );
    console.log(adminPDA.toBase58());
    console.log(userPDA.toBase58());

    // const connection = new Connection(
    //   "https://quiet-flashy-dream.solana-devnet.quiknode.pro/12ecf67b85c5f615f78ab0b3d68d636cf54f679b/",
    //   "confirmed"
    // );
    const anchorProvider = new AnchorProvider(
      connection,
      adapterWalletObj,
      "processed"
    );

    const program = new Program(IDL, programID, anchorProvider);

    const adminTokenAccount = await getAssociatedTokenAddress(
      mintToken,
      adminPDA,
      true
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mintToken,
      publicKey
    );

    /* Create Token Account */

    // const associatedTokenaddress = await getAssociatedTokenAddress(
    //   mintToken,
    //   adminPDA,
    //   true
    // );

    // console.log(associatedTokenaddress);

    // const transaction = new Transaction().add(
    //   createAssociatedTokenAccountInstruction(
    //     publicKey,
    //     associatedTokenaddress,
    //     adminPDA,
    //     mintToken
    //   )
    // );

    // const {
    //   context: { slot: minContextSlot },
    //   value: { blockhash, lastValidBlockHeight },
    // } = await connection.getLatestBlockhashAndContext();

    // const signature = await sendTransaction(transaction, connection, {
    //   minContextSlot,
    // });

    // await connection.confirmTransaction({
    //   blockhash,
    //   lastValidBlockHeight,
    //   signature,
    // });
    // console.log(signature);

    /* initialize admin */

    // const tx = await program.methods
    //   .initializeAdmin()
    //   .accounts({
    //     user: publicKey,
    //     adminPda: adminPDA,
    //     stakingToken: mintToken,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     systemProgram: SystemProgram.programId,
    //   })
    //   .signers([])
    //   .rpc();
    // console.log(tx);

    /* initialize */

    // const tx = await program.methods
    //   .initialize(new BN(1e1))
    //   .accounts({
    //     user: publicKey,
    //     adminPda: adminPDA,
    //     userInfo: userPDA,
    //     userStakingWallet: userTokenAccount,
    //     adminStakingWallet: adminTokenAccount,
    //     stakingToken: mintToken,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     systemProgram: SystemProgram.programId,
    //   })
    //   .signers([])
    //   .rpc();
    // console.log(tx);

    /* stake */

    // const tx = await program.methods
    //   .stake(new BN(1e1))
    //   .accounts({
    //     user: publicKey,
    //     adminPda: adminPDA,
    //     userInfo: userPDA,
    //     userStakingWallet: userTokenAccount,
    //     adminStakingWallet: adminTokenAccount,
    //     stakingToken: mintToken,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //   })
    //   .signers([])
    //   .rpc();
    // console.log(tx);

    // const userTokenAccount1 = await getAssociatedTokenAddress(
    //   mintToken,
    //   userSecret.publicKey
    // );

    /* unstake */

    // const tx = await program.methods
    //   .unstake()
    //   .accounts({
    //     user: publicKey,
    //     adminPda: adminPDA,
    //     userInfo: userPDA,
    //     userStakingWallet: userTokenAccount,
    //     adminStakingWallet: adminTokenAccount,
    //     stakingToken: mintToken,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     systemProgram: SystemProgram.programId,
    //   })
    //   .signers([])
    //   .rpc();
    // console.log(tx);

    const data = await program.account.userInfo.fetch(userPDA);

    const milliseconds = await connection.getBlockTime(
      parseInt(data.depositSlot)
    );
    const now = new Date();
    var utc_now = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
    const difference = utc_now.getTime() - milliseconds * 1000;
    console.log(new Date(Date.now() - difference));
  };

  return (
    <>
      <div className="relative flex flex-row justify-between items-center solana-logo h-[210px] sm:h-[200px] gap-24 w-full">
        <div className="flex flex-col px-5 sm:px-16 z-10">
          <p className="text-[50px] font-bold">Solena Stake</p>
          <span className="text-lg font-medium text-[#7979AC]">
            An easy, secure, fast, and user-friendly exchange for all your
            favorite Solana SPL tokens.
          </span>
        </div>
        <div className="absolute top-0 left-0 w-full h-full block sm:hidden z-0">
          <img className="pointer-events-none" src="/images/bar/1.jpg" alt="" />
        </div>
        <div className="h-full hidden sm:block">
          <img
            className="h-full pointer-events-none"
            src="/images/solana-logo.png"
            alt=""
          />
        </div>
      </div>
      <FixedStakingComponent setShowModal={setShowModal} />
      {/* <HarvestGroupContainer /> */}
      <Modal showModal={showModal} setShowModal={setShowModal} />
      {/* <button onClick={stakeFeature}>stakeFeature</button> */}
    </>
  );
};
