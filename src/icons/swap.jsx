import React from "react";

export default function Swap({ fill, width, height }) {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 16 15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 10L3 10L7 14"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 5L13 5L9 1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
