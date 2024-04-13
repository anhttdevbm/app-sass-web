import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const AddCircleGradientIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="mainGradient" x1="0" x2="1" y1="0" y2="0">
          <stop stopColor="#2AF598" offset="0%"/>
          <stop stopColor="#009EFD" offset="100%"/>
        </linearGradient>
      </defs>
      <path
        d="M12 .54c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12-5.383-12-12-12Zm5.25 13H13v4.25a1 1 0 0 1-2 0v-4.25H6.75a1 1 0 0 1 0-2H11V7.29a1 1 0 0 1 2 0v4.25h4.25a1 1 0 0 1 0 2Z"
        fill="url(#mainGradient)"
      />
    </SvgIcon>
  );
};

export default memo(AddCircleGradientIcon);
