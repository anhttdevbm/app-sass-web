import React from "react";
import { SvgIconProps } from "@mui/material";
import { SvgIcon } from "components/shared";

const ChangeIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fontSize="inherit"
      {...props}
    >
      <g
        transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="none"
      >
        <path
          d="M45 216 c-23 -23 -25 -32 -25 -121 l0 -95 35 0 c19 0 35 5 35 10 0 6
-11 10 -25 10 -24 0 -25 2 -25 69 0 65 2 70 23 73 16 2 23 11 25 31 3 24 7 27
43 27 38 0 39 -1 39 -37 0 -26 3 -34 11 -26 6 6 9 26 7 44 -3 34 -3 34 -60 37
-51 3 -61 0 -83 -22z m21 -33 c-10 -10 -19 5 -10 18 6 11 8 11 12 0 2 -7 1
-15 -2 -18z"
        />
        <path
          d="M100 109 c0 -26 21 -35 35 -16 16 23 42 21 57 -3 15 -23 28 -26 28
-7 0 27 -35 47 -78 45 -33 -1 -42 -5 -42 -19z"
        />
        <path
          d="M97 62 c-4 -5 3 -22 14 -36 18 -23 27 -26 63 -23 32 3 41 8 41 23 0
12 -7 19 -20 19 -11 0 -19 -6 -18 -12 3 -14 -25 -17 -43 -5 -6 4 -15 15 -21
26 -6 11 -13 14 -16 8z"
        />
      </g>
    </SvgIcon>
  );
};

export default ChangeIcon;
