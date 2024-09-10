import { PhantomWalletName } from "@solana/wallet-adapter-phantom";
import { useEffect, useState } from "react";
import { fetchCoins } from "../services/swap";
import { useToken } from "../context/tokenContext/provider";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletConnectionError,
  WalletNotReadyError,
} from "@solana/wallet-adapter-base";
import { toastNotify } from "../utils/toast";
import { MdOutlineVerified } from "react-icons/md";
import { GoVerified } from "react-icons/go";

import { Connection, VersionedTransaction } from "@solana/web3.js";
const SwapComponent = () => {
  const [sendAmount, setSendAmount] = useState(100);
  const [recieveAmount, setRecieveAmount] = useState(0);
  const [sendMenu, setSendMenu] = useState(false);
  const [recieveMenu, setRecieveMenu] = useState(false);
  const [tab, setTab] = useState("cheap");
  const { currentSendToken, currentRecieveToken } = useToken();
  const { setCurrentSendToken, setCurrentRecieveToken } = useToken();
  const [sendTokenPrice, setSendTokenPrice] = useState(1);
  const [recieveTokenPrice, setRecieveTokenPrice] = useState(1);
  const [priceImpact, setPriceImpact] = useState(0);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const filteredCoins = coins?.filter(
    (coin) =>
      (coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      coin.logoURI &&
      coin.logoURI.indexOf("i.imgur.com") === -1 &&
      coin.logoURI.indexOf("turquoise-worried-llama-208.mypinata.cloud") ===
        -1 &&
      coin.logoURI.indexOf("pbs.twimg.com") === -1 &&
      coin.logoURI.indexOf("assets.blocksmithlabs.io") === -1 &&
      coin.logoURI.indexOf("gateway.ipfscdn.io") === -1 &&
      coin.logoURI.indexOf("media.discordapp.ne") === -1 &&
      coin.logoURI.indexOf("shop.alienchickenfarm.com") === -1 &&
      coin.logoURI.indexOf("cdn.discordapp.com") === -1 &&
      coin.logoURI.indexOf("scontent.fcrk3-2.fna.fbcdn.net") === -1 &&
      coin.logoURI.indexOf("images-ext-1.discordapp.net") === -1 &&
      coin.logoURI.indexOf("coffee-deliberate-clam-397.mypinata.cloud") ===
        -1 &&
      coin.logoURI.indexOf("i.ibb.co") === -1 &&
      coin.logoURI.indexOf(".ipfs.nftstorage.link") === -1 &&
      coin.logoURI.indexOf("wrap.dingocoin.org") === -1 &&
      coin.logoURI.indexOf("file:///C:/Users/") === -1 &&
      coin.logoURI.indexOf("cf-ipfs.com") === -1 &&
      coin.logoURI.indexOf("cloudflare-ipfs.com") === -1 &&
      coin.logoURI.indexOf("github.com") === -1 &&
      coin.logoURI.indexOf("assets.blockstars.gg") === -1 &&
      coin.logoURI.indexOf("Qmedv9C7uSNDmFhCwa8Qd1ns2xgtE1hRucRN74KoJNjAYF") ===
        -1 &&
      coin.logoURI.indexOf("dl.airtable.com") === -1
  );
  const filteredCoins2 = coins?.filter(
    (coin) =>
      (coin.symbol.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        coin.address.toLowerCase().includes(searchTerm2.toLowerCase())) &&
      coin.logoURI &&
      coin.logoURI.indexOf("i.imgur.com") === -1 &&
      coin.logoURI.indexOf("turquoise-worried-llama-208.mypinata.cloud") ===
        -1 &&
      coin.logoURI.indexOf("pbs.twimg.com") === -1 &&
      coin.logoURI.indexOf("assets.blocksmithlabs.io") === -1 &&
      coin.logoURI.indexOf("gateway.ipfscdn.io") === -1 &&
      coin.logoURI.indexOf("media.discordapp.ne") === -1 &&
      coin.logoURI.indexOf("shop.alienchickenfarm.com") === -1 &&
      coin.logoURI.indexOf("cdn.discordapp.com") === -1 &&
      coin.logoURI.indexOf("scontent.fcrk3-2.fna.fbcdn.net") === -1 &&
      coin.logoURI.indexOf("images-ext-1.discordapp.net") === -1 &&
      coin.logoURI.indexOf("coffee-deliberate-clam-397.mypinata.cloud") ===
        -1 &&
      coin.logoURI.indexOf("i.ibb.co") === -1 &&
      coin.logoURI.indexOf(".ipfs.nftstorage.link") === -1 &&
      coin.logoURI.indexOf("wrap.dingocoin.org") === -1 &&
      coin.logoURI.indexOf("file:///C:/Users/") === -1 &&
      coin.logoURI.indexOf("cf-ipfs.com") === -1 &&
      coin.logoURI.indexOf("cloudflare-ipfs.com") === -1 &&
      coin.logoURI.indexOf("github.com") === -1 &&
      coin.logoURI.indexOf("assets.blockstars.gg") === -1 &&
      coin.logoURI.indexOf("Qmedv9C7uSNDmFhCwa8Qd1ns2xgtE1hRucRN74KoJNjAYF") ===
        -1 &&
      coin.logoURI.indexOf("dl.airtable.com") === -1
  );

  const connection = new Connection(
    "https://prettiest-stylish-research.solana-mainnet.quiknode.pro/26809c4295ddc594145dd266b6733e0de2bcc9d7",
    "confirmed"
  );

  const {
    select,
    connect,

    connected,
    publicKey,
    signTransaction,
  } = useWallet();

  const handleCheap = () => {
    setTab("cheap");
  };
  const handleFast = () => {
    setTab("fast");
  };
  const fetchTokenPrice = async (id) => {
    const response = await axios.get(`https://price.jup.ag/v6/price?ids=${id}`);
    return response.data.data[id]?.price || 1;
  };

  useEffect(() => {
    if (sendAmount !== "" && !isNaN(parseFloat(sendAmount))) {
      getQuote(sendAmount);
    }
  }, [sendAmount, currentSendToken]);

  useEffect(() => {
    const getCoins = async () => {
      const data = await fetchCoins();
      setCoins(data);
    };
    getCoins();
  }, []);

  useEffect(() => {
    const updatePrices = async () => {
      const sendPrice = await fetchTokenPrice(currentSendToken.id);
      const recievePrice = await fetchTokenPrice(currentRecieveToken.id);
      setSendTokenPrice(sendPrice);
      setRecieveTokenPrice(recievePrice);
      // setRecieveAmount((sendAmount * sendPrice) / recievePrice);
    };

    updatePrices();
  }, [currentSendToken, currentRecieveToken, sendAmount]);
  async function getQuote(currentAmount) {
    const amount = parseFloat(currentAmount);

    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid amount:", currentAmount);
      return;
    }

    const quote = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${
          currentSendToken.id
        }&outputMint=${currentRecieveToken.id}&amount=${
          amount * Math.pow(10, currentSendToken.decimals)
        }&slippage=50`
      )
    ).json();

    if (quote && quote.outAmount) {
      const outAmountNumber =
        Number(quote.outAmount) / Math.pow(10, currentRecieveToken.decimals);
      setRecieveAmount(outAmountNumber);
      setPriceImpact(parseFloat(quote.priceImpactPct));
    }

    setQuoteResponse(quote);
  }
  const connectwallet = async () => {
    try {
      await select(PhantomWalletName);

      await connect();
    } catch (err) {
      console.log("Error", err);
      if (err instanceof WalletNotReadyError) {
        toastNotify("warning", "Wallet Not Ready");
      } else if (err instanceof WalletConnectionError) {
        toastNotify("error", "Wallet Connection Error");
      }
    }
  };

  async function handleSwap() {
    if (!connected || !signTransaction) {
      toastNotify(
        "error",
        "Wallet is not connected or does not support signing transactions"
      );
      return;
    }

    const { swapTransaction } = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey?.toString(),
          wrapAndUnwrapSol: true,
          // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
          // feeAccount: "fee_account_public_key"
        }),
      })
    ).json();

    try {
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );
      console.log(`https://solscan.io/tx/${txid}`);

      toastNotify("success", "Swap successfully!");
    } catch (error) {
      toastNotify("error", "Error signing or sending the transaction", error);
    }
  }

  const handleChange = async () => {
    setCurrentRecieveToken(currentSendToken);
    setCurrentSendToken(currentRecieveToken);
  };
  return (
    <div className="h-full py-0 sm:py-8 w-full sm:w-[500px]">
      <div className="mb-0 bg-white border border-border rounded-[34px] bg-opacity-5  p-6  ">
        <h2 className="text-base font-medium text-gray-400 mb-2">You send</h2>
        <div className="flex items-center justify-between w-full py-4">
          <div className="flex items-center">
            <img
              src={currentSendToken.logoURI}
              alt="USDC"
              className="w-8 h-8 mr-2"
            />
            <span className="text-white text-xl mr-2">
              {currentSendToken.symbol}
            </span>
            <img
              src={sendMenu ? "/images/icons/down.svg" : "/images/icons/up.svg"}
              alt="icon"
              className="cursor-pointer"
              onClick={() => setSendMenu(!sendMenu)}
            />

            {sendMenu && (
              <>
                <div
                  className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-40 z-40"
                  onClick={() => {
                    setSendMenu(false);
                  }}
                ></div>
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                  <div className="absolute h-[450px] z-50 rounded-xl shadow-lg p-4 text-white backdrop-blur-3xl w-[300px] sm:w-[400px] top-5 bottom-0 bg-white border border-border bg-opacity-0 pointer-events-auto">
                    <input
                      type="text"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by token or paste address"
                      className="w-full p-2 mb-4 bg-[#1b1b36] rounded text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="overflow-y-auto h-[350px] space-y-3">
                      {filteredCoins.map((coin, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCurrentSendToken({
                              symbol: coin.symbol,
                              logoURI: coin.logoURI,
                              id: coin.address,
                              decimals: coin.decimals,
                            });
                            setSendMenu(false);
                          }}
                          className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#1b1b36] rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={coin.logoURI}
                              className="w-6 rounded-full"
                              alt={coin.symbol}
                            />
                            <span className="text-sm">{coin.symbol}</span>
                            <GoVerified color="#5F78FF" />
                          </div>
                          <span className="text-xs text-gray-400">{`${coin.address.substring(
                            0,
                            5
                          )}...${coin.address.substring(
                            coin.address.length - 5
                          )}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-end flex-grow">
            <input
              value={sendAmount}
              onChange={(e) => {
                const value = e.target.value;
                setSendAmount(value);
              }}
              className="text-white text-2xl font-semibold bg-transparent border-none focus:outline-none text-right w-[150px]"
            />
            <p className="text-tertiary text-sm">
              ${(sendAmount * sendTokenPrice).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center -my-5  ">
        <button
          onClick={() => handleChange()}
          className="w-12 z-10 h-12 shadow-gradient   font-bold text-xs bg-gradient-to-r from-gradient-start to-gradient-end rounded-full flex items-center justify-center"
        >
          <img src="/images/icons/shape.svg" />
        </button>
      </div>

      <div className="mb-8  bg-white border border-border rounded-[34px] bg-opacity-5  p-6 ">
        <h2 className="text-base font-medium text-gray-400 mb-2">
          You receive
        </h2>
        <div className="flex items-center justify-between   py-4">
          <div className="flex items-center">
            <img
              src={currentRecieveToken.logoURI}
              alt="ICON"
              className="w-8 h-8 mr-2"
            />
            <span className="text-white text-xl mr-2">
              {currentRecieveToken.symbol}
            </span>
            <img
              src={
                recieveMenu ? "/images/icons/down.svg" : "/images/icons/up.svg"
              }
              alt="icon"
              onClick={() => setRecieveMenu(!recieveMenu)}
              className="cursor-pointer"
            />
            {recieveMenu && (
              <>
                <div
                  className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-40 z-40"
                  onClick={() => setRecieveMenu(false)}
                ></div>
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                  <div className="absolute h-[450px] z-50 rounded-xl shadow-lg p-4 text-white backdrop-blur-3xl w-[300px] sm:w-[400px] top-5 bottom-0 bg-white border border-border bg-opacity-0 pointer-events-auto">
                    <input
                      type="text"
                      onChange={(e) => setSearchTerm2(e.target.value)}
                      placeholder="Search by token or paste address"
                      className="w-full p-2 mb-4 bg-[#1b1b36] rounded text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="overflow-y-auto h-[350px] space-y-3">
                      {filteredCoins2.map((coin, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCurrentRecieveToken({
                              symbol: coin.symbol,
                              logoURI: coin.logoURI,
                              id: coin.address,
                              decimals: coin.decimals,
                            });
                            setRecieveMenu(false);
                          }}
                          className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#1b1b36] rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={coin.logoURI}
                              className="w-6 rounded-full"
                              alt={coin.symbol}
                            />
                            <span className="text-sm">{coin.symbol}</span>
                            <GoVerified color="#5F78FF" />
                          </div>
                          <span className="text-xs text-gray-400">{`${coin.address.substring(
                            0,
                            5
                          )}...${coin.address.substring(
                            coin.address.length - 5
                          )}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-end flex-grow">
            <input
              type="text"
              value={recieveAmount.toFixed(8)}
              disabled
              onChange={(e) => setRecieveAmount(e.target.value)}
              className="text-white md:max-w-80 text-2xl font-bold bg-transparent border-none focus:outline-none text-right w-[150px]"
            />
            <p className="text-tertiary text-sm">
              ${(recieveAmount * recieveTokenPrice).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex text-xs gap-1  border-border border rounded-full items-center">
          <button
            onClick={handleCheap}
            className={
              tab === "cheap"
                ? "bg-gradient-to-r font-semibold from-gradient-start to-gradient-end text-black rounded-full  flex items-center gap-2 px-3 py-1"
                : " px-3 py-1 text-white font-semibold rounded-full flex items-center gap-2"
            }
          >
            <img
              src="/images/icons/cheap.svg"
              className="rounded-full shadow-xl"
            />
            Cheap
          </button>
          <button
            onClick={handleFast}
            className={
              tab === "fast"
                ? "bg-gradient-to-r  font-semibold from-gradient-start to-gradient-end text-black   rounded-full  flex items-center gap-2 px-3 py-1  "
                : "py-1 px-3 text-white font-semibold rounded-full flex items-center gap-2"
            }
            style={{
              boxShadow: "0px 4px 6px rgba(27, 27, 54, 0.05)",
            }}
          >
            Fast
            <img src="/images/icons/fast.svg" />
          </button>
        </div>
        <p className="text-white text-sm sm:text-base">
          Cheap, but slow transaction
        </p>
      </div>

      <div className=" p-4">
        <div className="flex items-center gap-2">
          <p className="text-white text-sm">
            1 {currentSendToken.symbol} ={" "}
            {(sendTokenPrice / recieveTokenPrice).toFixed(8)}{" "}
            {currentRecieveToken.symbol}
          </p>
          <img
            src="/images/icons/check-rounded.svg"
            className="w-4"
            alt="icon"
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-tertiary text-sm font-semibold">
            <p>Minimum Received</p>
            <p>Price Impact</p>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">
              {(recieveAmount * 0.99).toFixed(8)}{" "}
              <span className="text-tertiary font-semibold">
                {currentRecieveToken.symbol}
              </span>{" "}
            </p>
            <p className="text-tertiary font-semibold text-sm">
              {" "}
              {priceImpact.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {!publicKey && (
        <button
          onClick={() => connectwallet()}
          className=" shadow-gradient font-semibold hover:text-white text-sm text-black rounded-2xl bg-gradient-to-r py-3 mt-2 from-gradient-start to-gradient-end w-full"
        >
          Connect Wallet
        </button>
      )}

      {connected && (
        <button
          onClick={() => handleSwap()}
          className=" shadow-gradient font-semibold hover:text-white text-sm text-black rounded-2xl bg-gradient-to-r py-3 mt-2 from-gradient-start to-gradient-end w-full"
        >
          Swap
        </button>
      )}
    </div>
  );
};

export default SwapComponent;
