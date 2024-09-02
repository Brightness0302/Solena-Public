import React from "react";

export default function Stake({ width, height }) {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 16 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 5C11.866 5 15 4.10457 15 3C15 1.89543 11.866 1 8 1C4.13401 1 1 1.89543 1 3C1 4.10457 4.13401 5 8 5Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 3V14.5294C1 15.2054 1.76071 15.8169 3 16.2625M15 3V14.5294C15 15.2054 14.2393 15.8169 13 16.2625"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.28571 13.1111V11.5556C6.28571 10.6964 7.05323 10 8 10C8.94677 10 9.71429 10.6964 9.71429 11.5556V13.1111M5 13.1111H11V17H5V13.1111Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
