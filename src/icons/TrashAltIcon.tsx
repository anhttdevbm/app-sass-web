import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const TrashAltIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.473 17.027c.14.14.329.22.527.223a.76.76 0 0 0 .75-.75v-8a.75.75 0 1 0-1.5 0v8a.76.76 0 0 0 .223.527ZM7 17.25a.76.76 0 0 1-.75-.75v-8a.75.75 0 0 1 1.5 0v8a.76.76 0 0 1-.75.75ZM9.473 17.027c.14.14.329.22.527.223a.76.76 0 0 0 .75-.75v-8a.75.75 0 1 0-1.5 0v8a.76.76 0 0 0 .223.527Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.75 2.75v1H19a.75.75 0 1 1 0 1.5h-1.294l-.826 13.14a3.05 3.05 0 0 1-3.04 2.86H6.16a3.05 3.05 0 0 1-3-2.86L2.296 5.25H1a.75.75 0 0 1 0-1.5h5.25V2.7A2 2 0 0 1 8.2.75h3.6a2 2 0 0 1 1.95 2Zm-6 1h4.5v-1a.45.45 0 0 0-.45-.45H8.2a.45.45 0 0 0-.45.45v1Zm-3.91 1.5.77 13.05a1.55 1.55 0 0 0 1.55 1.45h7.68a1.56 1.56 0 0 0 1.55-1.45l.81-13-12.36-.05Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default memo(TrashAltIcon);
