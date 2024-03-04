import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const SplitIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.98749 14.529L1.45832 11.9999L3.98749 9.4707"
        stroke="currentColor"
        strokeWidth="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.54169 12L1.52919 12"
        stroke="currentColor"
        strokeWidth="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="11"
        y="2"
        width="1.5"
        height="20"
        rx="0.75"
        fill="currentColor"
      />
      <path
        d="M19.5125 9.47096L22.0417 12.0001L19.5125 14.5293"
        stroke="currentColor"
        strokeWidth="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9583 12L21.9708 12"
        stroke="currentColor"
        strokeWidth="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default memo(SplitIcon);
