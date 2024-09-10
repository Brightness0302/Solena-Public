import Chart from "react-apexcharts";
import { useToken } from "../../context/tokenContext/provider";
import axios from "axios";
import { useEffect, useState } from "react";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const COINGECKO_API_KEY = "CG-YB1hTp8X6ztpPEqEr2FCUGDB";
const COINGECKO_API_URL = "https://pro-api.coingecko.com/api/v3/coins/";

const SwapChart = () => {
  const { currentSendToken, currentRecieveToken } = useToken();
  const [series, setSeries] = useState([{ name: "candle", data: [] }]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("1w");

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down("md"));

  const timeRanges = {
    "24h": 1 * 24 * 60 * 60,
    "3d": 3 * 24 * 60 * 60,
    "1w": 7 * 24 * 60 * 60,
    "1m": 30 * 24 * 60 * 60,
  };

  useEffect(() => {
    const fetchTokenIdAndData = async () => {
      setCurrentPrice(null);
      try {
        const tokenAddress = currentSendToken.id;
        const tokenResponse = await axios.get(
          `${COINGECKO_API_URL}/solana/contract/${tokenAddress}`,
          {
            headers: {
              accept: "application/json",
              "x-cg-pro-api-key": COINGECKO_API_KEY,
            },
          }
        );

        const tokenId = tokenResponse.data.id;
        // console.log("id", tokenResponse.data);

        const token1Address = currentRecieveToken.id;
        const token1Response = await axios.get(
          `${COINGECKO_API_URL}/solana/contract/${token1Address}`,
          {
            headers: {
              accept: "application/json",
              "x-cg-pro-api-key": COINGECKO_API_KEY,
            },
          }
        );

        const token1Id = token1Response.data.id;
        // console.log("id", token1Response.data);

        const now = Math.floor(Date.now() / 1000);
        const from = now - timeRanges[selectedTimeRange];
        const to = now;

        const ohlcResponse = await axios.get(
          `${COINGECKO_API_URL}/${tokenId}/ohlc/range`,
          {
            params: {
              vs_currency: "usd",

              interval: "hourly",
              from,
              to,
            },
            headers: {
              accept: "application/json",
              "x-cg-pro-api-key": COINGECKO_API_KEY,
            },
          }
        );

        const ohlc1Response = await axios.get(
          `${COINGECKO_API_URL}/${token1Id}/ohlc/range`,
          {
            params: {
              vs_currency: "usd",

              interval: "hourly",
              from,
              to,
            },
            headers: {
              accept: "application/json",
              "x-cg-pro-api-key": COINGECKO_API_KEY,
            },
          }
        );

        const prices = [];

        for (var i = 0; i < ohlcResponse.data.length; i++) {
          const tmp_data = ohlcResponse.data[i];
          const tmp_data1 = ohlc1Response.data[i];
          prices.push([
            tmp_data[0],
            tmp_data[1] / tmp_data1[1],
            tmp_data[2] / tmp_data1[2],
            tmp_data[3] / tmp_data1[3],
            tmp_data[4] / tmp_data1[4],
          ]);
        }

        // console.log("prices", prices);

        const formattedData = prices.map((price, index) => ({
          x: new Date(price[0]),
          y: [price[1], price[2], price[3], price[4]],
        }));

        setSeries([{ name: "candlestick", data: formattedData }]);
        setCurrentPrice(prices[prices.length - 1][4]);
        setPriceChange(
          ((prices[prices.length - 1][4] - prices[0][1]) / prices[0][1]) * 100
        );
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    if (currentSendToken) {
      fetchTokenIdAndData();
    }
  }, [selectedTimeRange, currentSendToken, currentRecieveToken]);

  const options = {
    chart: {
      type: "candlestick",
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
      decimalsInFloat: 4,
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
        <div
          className={`text-base font-medium ${
            priceChange > 0 ? "text-primary" : "text-red-500"
          }`}
        >
          {priceChange
            ? `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(2)}%`
            : "+0.00%"}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full ">
          <div className="flex items-end gap-5 mt-1">
            <div className="font-bold text-3xl sm:text-5xl text-white">
              {" "}
              ${currentPrice ? currentPrice.toFixed(3) : "Loading..."}
            </div>
            <div className="flex items-center gap-2">
              <img src={currentSendToken.logoURI} className="w-6" alt="icon" />
              <img
                src={currentRecieveToken.logoURI}
                className="w-6"
                alt="icon"
              />
              <div className="font-semibold text-base">
                {currentSendToken.symbol}/{currentRecieveToken.symbol}
              </div>
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
      {/* <div className="absolute bottom-16">
        <img src="/images/bar/line.svg" alt="icon" />
      </div> */}
      <Chart
        options={options}
        series={series}
        type="candlestick"
        height={downMd ? 300 : 500}
      />
    </div>
  );
};

export default SwapChart;
