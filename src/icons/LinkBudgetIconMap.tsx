import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const LinkBudgetIconMap = (props: SvgIconProps) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.55 9.11719C13.425 10.9922 13.425 14.0255 11.55 15.8922C9.67504 17.7589 6.6417 17.7672 4.77504 15.8922C2.90837 14.0172 2.90004 10.9839 4.77504 9.11719"
        stroke="#1BC5BD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.49171 11.1734C7.54171 9.22344 7.54171 6.05677 9.49171 4.09844C11.4417 2.14011 14.6084 2.14844 16.5667 4.09844C18.525 6.04844 18.5167 9.21511 16.5667 11.1734"
        stroke="#1BC5BD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default memo(LinkBudgetIconMap);
