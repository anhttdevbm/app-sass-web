import React from "react";
import useTheme from "hooks/useTheme";

const IconCode = () => {
  const { isDarkMode } = useTheme();
  const c = isDarkMode ? "#F2FFF2" : "#212121";
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.60008 8.9707L7.11008 11.4607C6.82008 11.7507 6.82008 12.2407 7.11008 12.5307L9.60008 15.0207"
        stroke={c}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3999 8.9707L16.8899 11.4607C17.1799 11.7507 17.1799 12.2407 16.8899 12.5307L14.3999 15.0207"
        stroke={c}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconCode;
