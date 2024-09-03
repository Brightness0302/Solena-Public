import React, { useContext, useEffect, useRef, useState } from "react";
import InfoContainer from "./infoContainer";
import { useNavigate } from "react-router-dom";
import { ProgramContext } from "../context/programContext/context";
import HarvestContainer from "./harvestContainer";
import { useWallet } from "@solana/wallet-adapter-react";
import Stake from "../pages/stake";

export default function FixedStakingComponent({ setShowModal }) {
  const { publicKey } = useWallet();
  const [, , userInformationState, updateInformation] =
    useContext(ProgramContext);

  const [type, setType] = useState(true);
  const rotateRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    updateInformation();
  }, [publicKey]);

  const selectInfoContainer = () => {
    navigate("/stake/sol");
    setShowModal(true);
  };

  const onReload = async () => {
    updateInformation();
    if (!rotateRef) return;
    if (!rotateRef.current.className.includes("open"))
      rotateRef.current.classList.add("open");
    else rotateRef.current.classList.remove("open");
    // await Promise.resolve().then(() => {
    //   rotateRef.current.classList.remove("open");
    // });
  };

  const renderHarvestContainers = () => {
    const listItems = [];
    for (var i = 0; i < userInformationState.stakingCount; i++) {
      listItems.push(
        <HarvestContainer
          key={i}
          seed={userInformationState.stakingSeeds[i]}
          type={type}
        />
      );
    }
    return <>{listItems}</>;
  };

  return (
    <div className=" h-screen flex flex-col gap-8 px-5 sm:px-16 py-8 w-full z-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-10">
        <p className="text-[50px] font-bold">Fixed Staking</p>
        <div className="flex flex-row justify-between items-center gap-10 flex-grow">
          <div className="flex flex-row justify-start items-center gap-5">
            <button
              className={`${type ? "typeActive" : "typeDeactive"
                } rounded-full px-4 py-2 text-xs font-semibold`}
              onClick={() => setType(true)}
            >
              Active
            </button>
            <button
              className={`${!type ? "typeActive" : "typeDeactive"
                } rounded-full px-4 py-2 text-xs font-semibold`}
              onClick={() => setType(false)}
            >
              Ended
            </button>
          </div>
          <div>
            <label
              htmlFor="toggleB"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggleB"
                  className="sr-only toggle"
                />
                <div className="toggleBackround block bg-transparent w-14 h-8 border-2 border-[#7979AC] rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
              </div>
              <div className="ml-3 font-medium text-xs text-[#7979AC]">
                Stacked Only
              </div>
            </label>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col md:flex-row justify-start gap-8">
        <Stake />
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3 flex-grow">
          {renderHarvestContainers()}
        </div>
      </div> */}
      {/* <div className="flex justify-center">
        <button
          className="px-10 py-3 border border-[#7979AC] flex flex-row gap-3 rounded-full"
          onClick={() => onReload()}
        >
          <img
            src="/images/icons/reload.png"
            alt=""
            ref={rotateRef}
            className="rotateIcon"
          />
          Reload
        </button>
      </div> */}
    </div>
  );
}
