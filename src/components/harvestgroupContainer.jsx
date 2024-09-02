import React from "react";
import HarvestContainer from "./harvestContainer";

export default function HarvestGroupContainer() {
  return (
    <div className="flex flex-col gap-8 px-5 sm:px-16 py-8 w-full z-10">
      <div className="flex flex-col sm:flex-row justify-start items-center gap-8 sm:gap-10">
        <p className="text-[50px] font-bold">Harvest</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
        <HarvestContainer />
      </div>
      <div className="flex justify-center">
        <button className="px-10 py-3 border border-[#7979AC] flex flex-row gap-3 rounded-full">
          <img src="/images/icons/reload.png" alt="" />
          Reload
        </button>
      </div>
    </div>
  );
}
