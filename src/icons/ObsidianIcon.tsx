import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

function ObsidianIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.7924 0.799805L7.69165 4.72429L4.7998 10.9806L9.18348 21.0652L15.4062 23.1999L16.5464 20.9151L18.9118 6.71118L14.7924 0.799805Z"
        fill="#34208C"
      />
      <path
        d="M18.9131 6.7099L14.5317 4.02637L8.48145 8.79533L15.4075 23.1986L16.5477 20.9138L18.9131 6.7099Z"
        fill="url(#paint0_linear_856_136313)"
      />
      <path
        d="M18.9112 6.71118L14.7919 0.799805L14.5298 4.02765L18.9112 6.71118Z"
        fill="#AF9FF4"
      />
      <path
        d="M14.5312 4.02765L14.7932 0.799805L7.69238 4.72429L8.48084 8.79661L14.5312 4.02765Z"
        fill="#4A37A0"
      />
      <path
        d="M8.48145 8.79688L9.18481 21.0654L15.4075 23.2001L8.48145 8.79688Z"
        fill="#4A37A0"
      />
      <defs>
        <linearGradient
          id="paint0_linear_856_136313"
          x1="18.3397"
          y1="18.844"
          x2="11.2635"
          y2="1.93421"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6C56CC" />
          <stop offset="1" stop-color="#9785E5" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
}

export default ObsidianIcon;
