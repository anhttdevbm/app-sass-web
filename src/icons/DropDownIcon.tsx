import { SvgIcon } from "components/shared";
import React from "react";
import { SvgIconProps } from "@mui/material";

const DropDownIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7 10L12 15L17 10H7Z" fill="currentcolor" />
    </SvgIcon>
  );
};

export default DropDownIcon;
