import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const MoveDotIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 6C11 4.9 10.1 4 9 4C7.9 4 7 4.9 7 6C7 7.1 7.9 8 9 8C10.1 8 11 7.1 11 6ZM11 18C11 16.9 10.1 16 9 16C7.9 16 7 16.9 7 18C7 19.1 7.9 20 9 20C10.1 20 11 19.1 11 18ZM11 12C11 10.9 10.1 10 9 10C7.9 10 7 10.9 7 12C7 13.1 7.9 14 9 14C10.1 14 11 13.1 11 12Z"
        fill="currentColor"
      />
      <path
        d="M18 6C18 4.9 17.1 4 16 4C14.9 4 14 4.9 14 6C14 7.1 14.9 8 16 8C17.1 8 18 7.1 18 6ZM18 18C18 16.9 17.1 16 16 16C14.9 16 14 16.9 14 18C14 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18ZM18 12C18 10.9 17.1 10 16 10C14.9 10 14 10.9 14 12C14 13.1 14.9 14 16 14C17.1 14 18 13.1 18 12Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default memo(MoveDotIcon);
