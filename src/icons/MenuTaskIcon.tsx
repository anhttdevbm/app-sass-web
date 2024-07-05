import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const MenuTaskIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 7.25H3C2.86614 7.25 2.75 7.13386 2.75 7C2.75 6.86614 2.86614 6.75 3 6.75H21C21.1339 6.75 21.25 6.86614 21.25 7C21.25 7.13386 21.1339 7.25 21 7.25Z"
        fill="#212121"
        stroke="#3699FF"
      />
      <path
        d="M21 12.25H3C2.86614 12.25 2.75 12.1339 2.75 12C2.75 11.8661 2.86614 11.75 3 11.75H21C21.1339 11.75 21.25 11.8661 21.25 12C21.25 12.1339 21.1339 12.25 21 12.25Z"
        fill="#212121"
        stroke="#3699FF"
      />
      <path
        d="M21 17.75H3C2.59 17.75 2.25 17.41 2.25 17C2.25 16.59 2.59 16.25 3 16.25H21C21.41 16.25 21.75 16.59 21.75 17C21.75 17.41 21.41 17.75 21 17.75Z"
        fill="#212121"
      />
    </SvgIcon>
  );
};

export default memo(MenuTaskIcon);
