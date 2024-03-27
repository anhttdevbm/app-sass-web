import React from "react";
import { SvgIconProps } from "@mui/material";
import { SvgIcon } from "components/shared";

const ConvertIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fontSize="inherit"
      {...props}
    >
      <path d="" stroke="none" fill="currentColor" fillRule="evenodd" />
      <path
        d="M 17.362 4.500 C 17.838 5.742, 16.774 6, 11.169 6 C 4.172 6, 2 6.995, 2 10.200 C 2 12.573, 3.216 12.485, 4.768 10 C 5.790 8.363, 7.100 8, 11.977 8 C 16.864 8, 17.834 8.270, 17.362 9.500 C 16.539 11.644, 18.371 11.352, 20.500 9 C 22.247 7.070, 22.247 6.930, 20.500 5 C 18.371 2.648, 16.539 2.356, 17.362 4.500 M 18.732 14 C 16.523 16.580, 5.668 17.029, 6.638 14.500 C 7.461 12.356, 5.629 12.648, 3.500 15 C 1.753 16.930, 1.753 17.070, 3.500 19 C 5.629 21.352, 7.461 21.644, 6.638 19.500 C 6.162 18.258, 7.226 18, 12.831 18 C 19.828 18, 22 17.005, 22 13.800 C 22 11.449, 20.856 11.519, 18.732 14"
        stroke="none"
        fill="currentColor"
        fillRule="evenodd"
      />
    </SvgIcon>
  );
};

export default ConvertIcon;
