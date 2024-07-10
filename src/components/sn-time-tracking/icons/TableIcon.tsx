import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const TableIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.6667 1H2.33333C1.59695 1 1 1.59695 1 2.33333V11.6667C1 12.403 1.59695 13 2.33333 13H11.6667C12.403 13 13 12.403 13 11.6667V2.33333C13 1.59695 12.403 1 11.6667 1Z"
        stroke="#4C526C"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1 4.99994H13M1 8.99994H13M5 4.99994V12.9999M9 4.99994V12.9999"
        stroke="#4C526C"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};

export default memo(TableIcon);
