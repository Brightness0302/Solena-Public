import { useEffect, useState } from "react";
import { fetchCoins } from "../services/swap";
import { useToken } from "../context/tokenContext/provider";

const SwapComponent = () => {
    const [sendAmount, setSendAmount] = useState(100);
    const [recieveAmount, setRecieveAmount] = useState(0.51284789);
    const [sendMenu, setSendMenu] = useState(false);
    const [recieveMenu, setRecieveMenu] = useState(false);
    const [tab, setTab] = useState("cheap");
    const { currentSendToken, currentRecieveToken } = useToken();
    const { setCurrentSendToken, setCurrentRecieveToken } = useToken();


    const [coins, setCoins] = useState([])
    const handleCheap = () => {
        setTab("cheap");
    };
    const handleFast = () => {
        setTab("fast");

    }
    useEffect(() => {

        const getCoins = async () => {
            const data = await fetchCoins();
            setCoins(data);

        }
        getCoins()
    }, []);
    return (
        <div className="h-full py-8 min-w-[500px]">
            <div className="mb-0 bg-white border border-border rounded-[34px] bg-opacity-5  p-6  ">
                <h2 className="text-base font-medium text-gray-400 mb-2">You send</h2>
                <div className="flex items-center justify-between relative   py-4">
                    <div className="flex items-center">
                        <img
                            src={currentSendToken.logoURI}
                            alt="USDC"
                            className="w-8 h-8 mr-2"
                        />
                        <span className="text-white text-xl mr-2">{currentSendToken.symbol}</span>
                        <img
                            src={sendMenu ? "/images/icons/down.svg" : "/images/icons/up.svg"}
                            alt="icon"
                            className="cursor-pointer"
                            onClick={() => setSendMenu(!sendMenu)}
                        />

                        {sendMenu && (

                            <div className="absolute h-[140px] backdrop-blur-3xl  overflow-y-auto w-[213px] top-14  bottom-0 -left-3 bg-white border border-border rounded-[34px] bg-opacity-0    mt-2 p-4">
                                <div className="text-white">
                                    {
                                        coins.map((coin, idx) => (
                                            <div onClick={() => {
                                                setCurrentSendToken({
                                                    symbol: coin.symbol,
                                                    logoURI: coin.logoURI
                                                })
                                                setSendMenu(false)
                                            }} key={idx} className="flex cursor-pointer text-tertiary  items-center gap-2 hover:text-white mb-2">
                                                <img src={coin.logoURI
                                                } className="w-6 rounded-full" />
                                                {coin.symbol}

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                        )}

                    </div>
                    <div className="text-right">
                        <input
                            type="text"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            className="text-white text-4xl font-semibold bg-transparent border-none focus:outline-none md:max-w-80 text-right"
                        />
                        <p className="text-tertiary text-sm">-$100.00</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center -my-5  ">
                <button className="w-12 z-10 h-12 shadow-gradient   font-bold text-xs bg-gradient-to-r from-gradient-start to-gradient-end rounded-full flex items-center justify-center">
                    <img src="/images/icons/shape.svg" />
                </button>
            </div>

            <div className="mb-8  bg-white border border-border rounded-[34px] bg-opacity-5  p-6 ">
                <h2 className="text-base font-medium text-gray-400 mb-2">You receive</h2>
                <div className="flex items-center justify-between relative  py-4">
                    <div className="flex items-center">
                        <img
                            src={currentRecieveToken.logoURI}
                            alt="ICON"
                            className="w-8 h-8 mr-2"
                        />
                        <span className="text-white text-xl mr-2">{
                            currentRecieveToken.symbol
                        }</span>
                        <img
                            src={recieveMenu ? "/images/icons/down.svg" : "/images/icons/up.svg"}
                            alt="icon"
                            onClick={() => setRecieveMenu(!recieveMenu)}
                            className="cursor-pointer"
                        />
                        {recieveMenu && (
                            <div className="absolute h-[140px] overflow-y-auto w-[213px] top-14 z-50 bottom-0 -left-3 bg-white border border-border rounded-[34px] bg-opacity-0 backdrop-blur-3xl  mt-2 p-4">
                                <div className="text-white">
                                    {
                                        coins.map((coin, idx) => (
                                            <div onClick={() => {
                                                setCurrentRecieveToken({
                                                    symbol: coin.symbol,
                                                    logoURI: coin.logoURI
                                                })
                                                setRecieveMenu(false)
                                            }} key={idx} className="flex cursor-pointer text-tertiary  items-center gap-2 hover:text-white mb-2">
                                                <img src={coin.logoURI
                                                } className="w-6 rounded-full" />
                                                {coin.symbol}

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <input
                            type="text"
                            value={recieveAmount}
                            disabled
                            onChange={(e) => setRecieveAmount(e.target.value)}
                            className="text-white md:max-w-80 text-4xl font-bold bg-transparent border-none focus:outline-none text-right"
                        />
                        <p className="text-tertiary text-sm">-$100.23</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex text-xs gap-1  border-border border rounded-full items-center">
                    <button onClick={handleCheap} className={tab === "cheap" ? "bg-gradient-to-r font-semibold from-gradient-start to-gradient-end text-black rounded-full  flex items-center gap-2 px-3 py-1" : " px-3 py-1 text-white font-semibold rounded-full flex items-center gap-2"}>
                        <img src="/images/icons/cheap.svg" className="rounded-full shadow-xl" />
                        Cheap
                    </button>
                    <button onClick={handleFast} className={tab === "fast" ? "bg-gradient-to-r  font-semibold from-gradient-start to-gradient-end text-black   rounded-full  flex items-center gap-2 px-3 py-1  " : "py-1 px-3 text-white font-semibold rounded-full flex items-center gap-2"} style={{
                        boxShadow: '0px 4px 6px rgba(27, 27, 54, 0.05)',
                    }}>
                        Fast
                        <img src="/images/icons/fast.svg" />
                    </button>
                </div>
                <p className="text-white ">Cheap, but slow transaction</p>
            </div>

            <div className=" p-4">
                <div className="flex items-center gap-2">
                    <p className="text-white text-sm">
                        1 {currentSendToken.symbol} = 0.0051172785 {currentRecieveToken.symbol}
                    </p>
                    <img src="/images/icons/check-rounded.svg" className="w-4" alt="icon" />
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div className="text-tertiary text-sm font-semibold">
                        <p>Minimum Received</p>
                        <p>Price Impact</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white text-sm">0.0051172785 <span className="text-tertiary font-semibold">{currentRecieveToken.symbol}</span> </p>
                        <p className="text-tertiary font-semibold text-sm">0.02%</p>
                    </div>
                </div>
            </div>
            <button className=" shadow-gradient font-semibold hover:text-white text-sm text-black rounded-2xl bg-gradient-to-r py-3 mt-2 from-gradient-start to-gradient-end w-full">Connect Wallet</button>

        </div >
    );
};

export default SwapComponent;
