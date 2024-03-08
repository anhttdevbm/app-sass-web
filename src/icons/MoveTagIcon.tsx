import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const MoveTagIcon = (props: SvgIconProps) => {
  return (
    // <SvgIcon
    //   viewBox="0 0 24 24"
    //   fill="none"
    //   fontSize="inherit"
    //   xmlns="http://www.w3.org/2000/svg"
    //   {...props}
    // >
    //   <path
    //     d="M11 6C11 4.9 10.1 4 9 4C7.9 4 7 4.9 7 6C7 7.1 7.9 8 9 8C10.1 8 11 7.1 11 6ZM11 18C11 16.9 10.1 16 9 16C7.9 16 7 16.9 7 18C7 19.1 7.9 20 9 20C10.1 20 11 19.1 11 18ZM11 12C11 10.9 10.1 10 9 10C7.9 10 7 10.9 7 12C7 13.1 7.9 14 9 14C10.1 14 11 13.1 11 12Z"
    //     fill="currentColor"
    //   />
    //   <path
    //     d="M18 6C18 4.9 17.1 4 16 4C14.9 4 14 4.9 14 6C14 7.1 14.9 8 16 8C17.1 8 18 7.1 18 6ZM18 18C18 16.9 17.1 16 16 16C14.9 16 14 16.9 14 18C14 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18ZM18 12C18 10.9 17.1 10 16 10C14.9 10 14 10.9 14 12C14 13.1 14.9 14 16 14C17.1 14 18 13.1 18 12Z"
    //     fill="currentColor"
    //   />
    // </SvgIcon>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <mask
        id="mask0_13789_4898"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="18"
        height="18"
      >
        <path
          d="M16.8333 16.834L16.8333 1.16726L1.1666 1.16726L1.1666 16.834L16.8333 16.834Z"
          fill="white"
          stroke="white"
        />
      </mask>
      <g mask="url(#mask0_13789_4898)">
        <path
          d="M15.539 1.15572H9.21361L1.53571 8.83345C1.02793 9.3414 1.02793 10.1725 1.53571 10.6803L7.32034 16.4648C7.82822 16.9727 8.65918 16.9727 9.16712 16.4648L16.8448 8.78693L16.845 2.46155C16.845 1.74332 16.2573 1.15572 15.539 1.15572Z"
          stroke="#1BC5BD"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.7689 5.71121C13.3604 6.1197 12.6981 6.1197 12.2896 5.71121C11.8811 5.30271 11.8811 4.6404 12.2896 4.232C12.6981 3.82344 13.3604 3.82337 13.7689 4.232C14.1774 4.6404 14.1774 5.30271 13.7689 5.71121Z"
          stroke="#1BC5BD"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default memo(MoveTagIcon);
