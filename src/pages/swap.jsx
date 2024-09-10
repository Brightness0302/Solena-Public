import SwapChart from "../components/charts/swapChart";
import SwapComponent from "../components/swap";

export const Swap = () => {
  return (
    <>
      <div className=" flex flex-row justify-between items-center solana-logo h-[210px] sm:h-[200px] gap-24 w-full">
        <div className="flex flex-col px-5 sm:px-16 z-10">
          <p className="text-[50px] font-bold">Solena Swap</p>
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

      <div className="px-5 sm:px-16">
        <div className="grid grid-cols-12 w-full gap-6">
          <div className="col-span-7">
            <SwapChart />
          </div>
          <div className="col-span-3/5 w-full ">
            <SwapComponent />
          </div>
        </div>
      </div>
    </>
  );
};
