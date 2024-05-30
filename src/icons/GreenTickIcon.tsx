import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const GreenTickIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 20"
      width="24"
      height="20"
      fontSize="inherit"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.19 18.966a1.222 1.222 0 0 1-1.733 0L.54 12.046a1.837 1.837 0 0 1 0-2.599l.866-.866a1.837 1.837 0 0 1 2.6 0l4.319 4.32L19.996 1.227a1.838 1.838 0 0 1 2.6 0l.865.867a1.837 1.837 0 0 1 0 2.599L9.19 18.966Z"
        fill="#03AE00"
      />
    </SvgIcon>
  );
};

export default memo(GreenTickIcon);
