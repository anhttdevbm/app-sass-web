import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const ArrowTriangleIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 103 8"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M102.354 4.35355C102.549 4.15829 102.549 3.84171 102.354 3.64645L99.1716 0.464466C98.9763 0.269204 98.6597 0.269204 98.4645 0.464466C98.2692 0.659728 98.2692 0.976311 98.4645 1.17157L101.293 4L98.4645 6.82843C98.2692 7.02369 98.2692 7.34027 98.4645 7.53553C98.6597 7.7308 98.9763 7.7308 99.1716 7.53553L102.354 4.35355ZM0 4.5H102V3.5H0V4.5Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default memo(ArrowTriangleIcon);
