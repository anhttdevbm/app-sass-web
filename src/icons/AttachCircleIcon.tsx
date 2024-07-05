import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const AttachCircleIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fill="none"
      fontSize="inherit"
      strokeWidth={1.5}
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.1999 11.8002L10.7899 13.2102C10.0099 13.9902 10.0099 15.2602 10.7899 16.0402C11.5699 16.8202 12.8399 16.8202 13.6199 16.0402L15.8399 13.8202C17.3999 12.2602 17.3999 9.73023 15.8399 8.16023C14.2799 6.60023 11.7499 6.60023 10.1799 8.16023L7.75988 10.5802C6.41988 11.9202 6.41988 14.0902 7.75988 15.4302"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
};

export default memo(AttachCircleIcon);
