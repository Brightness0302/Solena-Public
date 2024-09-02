export const formatLargeNumber = (num) => {
  if (Number(num) === 0) {
    return "0.00";
  }
  const units = ["", "K", "M", "B", "T", "P", "E", "Z", "Y", "OC", "NC", "DC"];
  const digits = Math.floor(Math.log10(Math.abs(num))) + 1;
  const unitIndex = Math.floor((digits - 1) / 3);

  if (unitIndex <= 0) {
    return Number(num).toFixed(3);
  }

  const value = num / Math.pow(1000, unitIndex);
  const formattedValue = value.toFixed(2).replace(/\.00$/, "");

  return `${formattedValue} ${units[unitIndex]}`;
};

export const generateSeed = () => {
  // Generate a random 32-bit number
  const randomU32 = Math.floor(Math.random() * 0x10000);
  return randomU32;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day}/${year} ${hours}:${minutes}`;
};

// Define an array of month names
export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const LABELS = {
  "change-wallet": "Change wallet",
  connecting: "Connecting ...",
  "copy-address": "Copy address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect",
  "no-wallet": "Connect Wallet",
};

export const smartContractAddress =
  "62R5JWWDzuYqyPGyp7otGbj5eD1Na7Tj5HX74tFBYkKh";
export const mintAddress = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
export const stage1 = 0.000000007;

export const desktopDurationRange = [0, 1, 3, 6, 12, 24, 36];
export const mobileDurationRange = [0, 3, 12, 36];
