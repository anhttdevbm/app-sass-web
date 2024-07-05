import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const PauseCircleIcon = (props: SvgIconProps) => {
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
        d="M11.97 22C17.4928 22 21.97 17.5228 21.97 12C21.97 6.47715 17.4928 2 11.97 2C6.44712 2 1.96997 6.47715 1.96997 12C1.96997 17.5228 6.44712 22 11.97 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10.72 14.5298V9.4698C10.72 8.9898 10.52 8.7998 10.01 8.7998H8.71C8.2 8.7998 8 8.9898 8 9.4698V14.5298C8 15.0098 8.2 15.1998 8.71 15.1998H10C10.52 15.1998 10.72 15.0098 10.72 14.5298Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 14.5298V9.4698C16 8.9898 15.8 8.7998 15.29 8.7998H14C13.49 8.7998 13.29 8.9898 13.29 9.4698V14.5298C13.29 15.0098 13.49 15.1998 14 15.1998H15.29C15.8 15.1998 16 15.0098 16 14.5298Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
};

export default memo(PauseCircleIcon);
