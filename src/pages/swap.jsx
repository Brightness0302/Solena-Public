import SwapChart from "../components/charts/swapChart";
import SwapComponent from "../components/swap";

export const Swap = () => {
  return (
    <>
      <div className=" flex flex-row justify-between items-center solana-logo h-[210px] sm:h-[200px] gap-24 w-full">
        <div className="flex flex-col px-5 sm:px-16 z-10">
          <p className="text-4xl md:text-[50px] font-bold">Solena Swap</p>
          <span className="text-lg sm:text-base md:text-lg font-medium text-[#7979AC]">
            An easy, secure, fast, and user-friendly exchange for all your
            favorite Solana SPL tokens.
          </span>
        </div>
        <div className="absolute top-0 left-0 h-[210px] sm:h-[200px] w-full block sm:hidden z-0">
          <img
            className="pointer-events-none h-[210px] sm:h-[200px] w-full"
            src="/images/bar/1.jpg"
            alt=""
          />
        </div>
        <div className="h-full hidden sm:block">
          <img
            className="h-full pointer-events-none"
            src="/images/solana-logo.png"
            alt=""
          />
        </div>
      </div>

      <div className="w-full px-5 sm:px-16">
        <div className="flex flex-col xl:flex-row w-full gap-6 xl:gap-10 pb-6 xl:pb-0 justify-center">
          <div className="flex-grow xl:flex-none xl:w-[600px]">
            <SwapChart />
          </div>
          <div className="flex flex-col justify-center items-center">
            <SwapComponent />
          </div>
        </div>
      </div>
    </>
  );
};
