import { useContext, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Swap from "../icons/swap";
import Stake from "../icons/stake";
import Farm from "../icons/farm";
import Launchpad from "../icons/launchpad";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { ProgramContext } from "../context/programContext/context";
import { LABELS, monthNames } from "../utils/resource";

function Layout() {
  const { publicKey } = useWallet();
  const [, , , updateInformation] = useContext(ProgramContext);

  useEffect(() => {
    if (!publicKey) return;

    updateInformation();
  }, [publicKey]);

  return (
    <div className="" style={{ minHeight: "100vh" }}>
      <header className="flex justify-between flex-row items-center px-5 sm:px-16 py-5 sm:py-0">
        <Link to={"https://solana-project-chi.vercel.app/"}>
          <img src="/logo.png" alt="" />
        </Link>
        <button className="block sm:hidden">
          <img
            className="w-[16px] h-[16px]"
            src="/images/icons/nav-icon.svg"
            alt=""
          />
        </button>
        <div className="flex-row justify-end gap-3 items-center hidden sm:flex">
          <div className="flex flex-row justify-start gap-1 items-center">
            <NavLink
              className="nav-text"
              to={"/swap"}
              style={({ isActive }) => {
                return isActive
                  ? {
                    background:
                      "linear-gradient(to bottom, #3CD2B500, #3CD2B519)",
                    borderBottom: "2px solid #3CD2B5",
                  }
                  : {};
              }}
            >
              Swap
            </NavLink>
            <NavLink
              className="nav-text"
              to={"/stake"}
              style={({ isActive }) => {
                return isActive
                  ? {
                    background:
                      "linear-gradient(to bottom, #3CD2B500, #3CD2B519)",
                    borderBottom: "2px solid #3CD2B5",
                  }
                  : {};
              }}
            >
              Stake
            </NavLink>
            <NavLink
              className="nav-text"
              to={"/farm"}
              style={({ isActive }) => {
                return isActive
                  ? {
                    background:
                      "linear-gradient(to bottom, #3CD2B500, #3CD2B519)",
                    borderBottom: "2px solid #3CD2B5",
                  }
                  : {};
              }}
            >
              Farm
            </NavLink>
            <NavLink
              className="nav-text"
              to={"/launchpad"}
              style={({ isActive }) => {
                return isActive
                  ? {
                    background:
                      "linear-gradient(to bottom, #3CD2B500, #3CD2B519)",
                    borderBottom: "2px solid #3CD2B5",
                  }
                  : {};
              }}
            >
              Launchpad
            </NavLink>
          </div>
          <BaseWalletMultiButton
            style={{
              width: "180px",
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
        </div>
        <div className="fixed bottom-0 left-0 w-full flex sm:hidden flex-row justify-between items-center h-[70px] backdrop-blur-sm filter bg-[#252548CC] rounded-t-3xl px-5 py-8 z-30 nav-bar">
          <NavLink
            className={`flex flex-col items-center gap-1`}
            to={"/"}
            style={({ isActive }) => {
              return isActive
                ? {
                  stroke: "#ECFDFF",
                  color: "#ECFDFF",
                }
                : {
                  stroke: "#7979AC",
                  color: "#7979AC",
                };
            }}
          >
            <Swap width={16} height={15} />
            <span className="text-xs font-normal">Swap</span>
          </NavLink>
          <NavLink
            className={`flex flex-col items-center gap-1`}
            to={"/stake"}
            style={({ isActive }) => {
              return isActive
                ? {
                  stroke: "#ECFDFF",
                  color: "#ECFDFF",
                }
                : {
                  stroke: "#7979AC",
                  color: "#7979AC",
                };
            }}
          >
            <Stake width={16} height={18} />
            <span className="text-xs font-normal">Stake</span>
          </NavLink>
          <NavLink
            className={`flex flex-col items-center gap-1`}
            to={"/farm"}
            style={({ isActive }) => {
              return isActive
                ? {
                  stroke: "#ECFDFF",
                  color: "#ECFDFF",
                }
                : {
                  stroke: "#7979AC",
                  color: "#7979AC",
                };
            }}
          >
            <Farm width={16} height={16} />
            <span className="text-xs font-normal">Farm</span>
          </NavLink>
          <NavLink
            className={`flex flex-col items-center gap-1`}
            to={"/launchpad"}
            style={({ isActive }) => {
              return isActive
                ? {
                  stroke: "#ECFDFF",
                  color: "#ECFDFF",
                }
                : {
                  stroke: "#7979AC",
                  color: "#7979AC",
                };
            }}
          >
            <Launchpad width={10} height={19} />
            <span className="text-xs font-normal">Launchpad</span>
          </NavLink>
        </div>
      </header>
      <main>
        <img
          className="w-full max-w-full object-cover absolute top-0 left-0 hidden sm:block pointer-events-none max-h-[100%]"
          src="/images/background.png"
          alt=""
        />
        <Outlet />
      </main>
      <footer className="flex flex-row justify-between items-center px-5 sm:px-16 py-8 invisible sm:visible h-[70px] sm:h-[100px]">
        <div className="w-[100px]">
          <img className="w-[42px] h-[36px]" src="/logo.png" alt="" />
        </div>
        <p className="font-medium text-[13px] text-[#7979AC]">
          Version 1.0 {monthNames[new Date().getUTCMonth()]}{" "}
          {new Date().getUTCDate()}, {new Date().getUTCFullYear()}
        </p>
        <div className="flex flex-row justify-between w-[100px]">
          <img src="/images/icons/twitter.png" alt="" />
          <img src="/images/icons/telegram.png" alt="" />
          <img src="/images/icons/discord.png" alt="" />
        </div>
      </footer>
    </div>
  );
}

export default Layout;
