import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const RepeatIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.10999 5.08039C9.97999 4.82039 10.94 4.65039 12 4.65039C16.79 4.65039 20.67 8.53039 20.67 13.3204C20.67 18.1104 16.79 21.9904 12 21.9904C7.20999 21.9904 3.32999 18.1104 3.32999 13.3204C3.32999 11.5404 3.86999 9.88039 4.78999 8.50039"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.87 5.32L10.76 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7.87 5.32031L11.24 7.78031"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default memo(RepeatIcon);
