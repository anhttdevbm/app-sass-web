import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const FileGroupIcon = (props: SvgIconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8333 1.66602H4.99992C4.55789 1.66602 4.13397 1.84161 3.82141 2.15417C3.50885 2.46673 3.33325 2.89065 3.33325 3.33268V16.666C3.33325 17.108 3.50885 17.532 3.82141 17.8445C4.13397 18.1571 4.55789 18.3327 4.99992 18.3327H14.9999C15.4419 18.3327 15.8659 18.1571 16.1784 17.8445C16.491 17.532 16.6666 17.108 16.6666 16.666V7.49935L10.8333 1.66602Z"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8333 1.66602V7.49935H16.6666"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default memo(FileGroupIcon);
