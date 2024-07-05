import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const FileIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 19 22"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.75 0C4.09688 0 3.5625 0.61875 3.5625 1.375V20.625C3.5625 21.3813 4.09688 22 4.75 22H16.625C17.2781 22 17.8125 21.3813 17.8125 20.625V5.5L13.0625 0H4.75Z"
        fill="#E2E5E7"
      />
      <path
        d="M14.25 5.5H17.8125L13.0625 0V4.125C13.0625 4.88125 13.5969 5.5 14.25 5.5Z"
        fill="#B0B7BD"
      />
    </SvgIcon>
  );
};

export default memo(FileIcon);
