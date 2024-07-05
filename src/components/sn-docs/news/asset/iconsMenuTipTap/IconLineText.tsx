import useTheme from "hooks/useTheme";
import React from "react";

const IconLineText = () => {
  const { isDarkMode } = useTheme();
  const c = isDarkMode ? "#F2FFF2" : "#212121";
  return (
    <svg
      width={21}
      height={20}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_9255_4053)">
        <path
          d="M3.77539 18V16.5H17.7754V18H3.77539ZM5.97539 10V3.6C5.97539 3.2 6.37539 3 6.77539 3C7.07539 3 7.47539 3.2 7.47539 3.6V9.8C7.47539 11.8 8.77539 12.6 10.6754 12.6C12.5754 12.6 14.0754 11.7 14.0754 9.7V3.6C14.0754 3.3 14.4754 3.1 14.8754 3.1C15.1754 3.1 15.5754 3.3 15.5754 3.6V10C15.5754 12.7 13.3754 14 10.6754 14C8.07539 14 5.97539 12.8 5.97539 10Z"
          fill={c}
        />
      </g>
      <defs>
        <clipPath id="clip0_9255_4053">
          <rect
            width={20}
            height={20}
            fill="white"
            transform="translate(0.775391)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconLineText;
