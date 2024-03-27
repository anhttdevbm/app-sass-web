import { SvgIconProps } from "@mui/material";
import { SvgIcon } from "components/shared";
import React from "react";

const BackIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="black"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.19999 11.9995C7.19999 11.2995 7.46998 10.5995 7.99998 10.0695L14.52 3.54953C14.81 3.25953 15.29 3.25953 15.58 3.54953C15.87 3.83953 15.87 4.31953 15.58 4.60953L9.05999 11.1295C8.57999 11.6095 8.57999 12.3895 9.05999 12.8695L15.58 19.3895C15.87 19.6795 15.87 20.1595 15.58 20.4495C15.29 20.7395 14.81 20.7395 14.52 20.4495L7.99998 13.9295C7.46998 13.3995 7.19999 12.6995 7.19999 11.9995Z"
        fill="#666666"
      />
    </SvgIcon>
  );
};

export default BackIcon;
