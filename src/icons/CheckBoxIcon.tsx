import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const CheckBoxIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 25 24"
      width="24"
      height="24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke="#999999"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default memo(CheckBoxIcon);
