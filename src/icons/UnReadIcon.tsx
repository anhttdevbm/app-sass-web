import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const UnReadIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.78892 0.860353C9.57407 0.645508 9.22576 0.645508 9.01118 0.860353L3.90005 5.97148L0.988918 3.06035C0.774343 2.8455 0.425758 2.8455 0.211183 3.06035C-0.00366242 3.27519 -0.00366242 3.62324 0.211183 3.83808L3.51118 7.13808C3.6186 7.2455 3.75933 7.29922 3.90005 7.29922C4.04077 7.29922 4.18149 7.24551 4.28891 7.13808L9.78891 1.63808C10.0038 1.42351 10.0038 1.07519 9.78892 0.860353Z"
        fill="#999999"
      />
    </SvgIcon>
  );
};

export default memo(UnReadIcon);
