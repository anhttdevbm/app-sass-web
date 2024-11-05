import { SvgIcon, SvgIconProps } from "@mui/material";
import { memo } from "react";

const NotificationIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10 3.17 10 4v.68C7.14 5.36 5.5 7.92 5.5 11v5l-1.7 1.7c-.14.14-.3.3-.3.58V19h17v-.72c0-.28-.16-.44-.3-.58L18 16zm-6-16c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" />
    </SvgIcon>
  );
};

export default memo(NotificationIcon);
