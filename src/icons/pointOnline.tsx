import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const pointOnline = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 10 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="7" cy="7" r="6.5" fill="#55C000" stroke="white" />
    </SvgIcon>
  );
};

export default memo(pointOnline);
