import Chart from "react-apexcharts";
import { useToken } from "../../context/tokenContext/provider";
import axios from "axios";
import { useEffect, useState } from "react";

const COINGECKO_API_KEY = "CG-YB1hTp8X6ztpPEqEr2FCUGDB";
const COINGECKO_API_URL = "https://pro-api.coingecko.com/api/v3/coins/solana/contract";


const SwapChart = () => {
  const { currentSendToken, currentRecieveToken } = useToken();
  const [series, setSeries] = useState([{ name: 'candle', data: [] }]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("1w");

  const timeRanges = {
    "24h": 1 * 24 * 60 * 60,
    "3d": 3 * 24 * 60 * 60,
    "1w": 7 * 24 * 60 * 60,
    "1m": 30 * 24 * 60 * 60,
  };
  function generateSimilarNumbers(mean, variation, count) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
      const randomVariation = (Math.random() - 0.5) * variation * 2;
      numbers.push(mean + randomVariation);
    }
    return numbers;
  }
  useEffect(() => {
    const fetchTokenData = async () => {
      const now = Math.floor(Date.now() / 1000);
      const from = now - timeRanges[selectedTimeRange];
      const to = now;

      const options = {
        method: 'GET',
        url: `${COINGECKO_API_URL}/${currentSendToken.id}/market_chart/range`,
        params: {
          vs_currency: 'usd',
          from,
          to
        },
        headers: {
          accept: 'application/json',
          'x-cg-pro-api-key': COINGECKO_API_KEY
        }
      };

      try {
        const response = await axios.request(options);
        const prices = response.data.prices;

        const formattedData = prices.map((price, index) => {
          const open = index === 0 ? price[1] : prices[index - 1][1];
          const close = price[1];
          const high = Math.max(open, close);
          const low = Math.min(open, close);
          const mean = (high + low) / 2;
          const variation = (high - low) / 2;
          return {
            x: new Date(price[0]),
            y: generateSimilarNumbers(mean, variation, 4)
          };
        });

        setSeries([{ data: formattedData }]);

        const firstPrice = prices[0][1];
        const lastPrice = prices[prices.length - 1][1];
        setCurrentPrice(lastPrice);
        setPriceChange(((lastPrice - firstPrice) / firstPrice) * 100);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchTokenData();
  }, [selectedTimeRange, currentSendToken.id]);

  const options = {
    chart: {
      type: "candlestick",
      height: 500,
      width: "100%",
      toolbar: {
        show: false,
      },
    },

    xaxis: {
      type: "datetime",
      labels: {
        show: true,

        style: {
          colors: "#9CA3AF",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: "right",
        minWidth: 10,
        maxWidth: 45,
        style: {
          colors: "#9CA3AF",
        },
      },
      opposite: true,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#3CD2B5",
          downward: "#5F78FF",
        },
      },
    },
    grid: {
      strokeDashArray: 5,

      borderColor: "#4B5563",
    },
  };

  return (
    <div className="py-6 w-full relative">
      <div className="mb-7">
        <div className={`text-base font-medium ${priceChange > 0 ? 'text-primary' : 'text-red-500'
          }`}>
          {priceChange ? `${priceChange.toFixed(2)}%` : "+0.00%"}
        </div>
        <div className="flex justify-between items-center gap-6 w-full ">
          <div className="flex items-center gap-2 mt-1">
            <div className="font-bold text-5xl text-white">   ${currentPrice ? currentPrice.toFixed(2) : "Loading..."}</div>
            <div className="flex items-center gap-2">
              <img src={currentSendToken.logoURI} className="w-6" alt="icon" />
              <img src={currentRecieveToken.logoURI} className="w-6" alt="icon" />
              <div className="font-semibold text-base">{currentSendToken.symbol}/{currentRecieveToken.symbol}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 ">

            {Object.keys(timeRanges).map((range, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTimeRange(range)}
                className={
                  selectedTimeRange === range
                    ? `shadow-gradient font-semibold text-xs bg-gradient-to-r from-gradient-start to-gradient-end text-black rounded-3xl h-10 w-16 text-center flex items-center justify-center cursor-pointer`
                    : `border font-semibold text-xs border-border text-tertiary rounded-3xl h-10 w-16 text-center flex items-center justify-center cursor-pointer`
                }
              >
                {range}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-16">
        <img src="/images/bar/line.svg" alt="icon" />
      </div>
      <Chart
        options={options}
        series={series}
        type="candlestick"
        height={500}

      />
    </div>
  );
};

export default SwapChart;
