import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const CircleChevronDownIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 10.793 7.732 8.146a.387.387 0 0 0-.606 0 .56.56 0 0 0 0 .708l2.571 3a.387.387 0 0 0 .606 0l2.571-3a.56.56 0 0 0 0-.708.387.387 0 0 0-.606 0L10 10.793Z"
        fill="currentColor"/>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.2 10A9.2 9.2 0 1 1 .8 10a9.2 9.2 0 0 1 18.4 0Zm-.2 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default memo(CircleChevronDownIcon);
