import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const ChevronIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 20 20"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
      {...props}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
};

export default memo(ChevronIcon);
