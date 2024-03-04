import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const TagIcon = (props: SvgIconProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_14337_29610"
        // style="mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="18"
        height="18"
      >
        <path
          d="M16.8334 16.8359V1.16921H1.16663V16.8359H16.8334Z"
          fill="white"
          stroke="white"
        />
      </mask>
      <g mask="url(#mask0_14337_29610)">
        <path
          d="M15.539 1.15768H9.21364L1.53574 8.8354C1.02796 9.34335 1.02796 10.1744 1.53574 10.6822L7.32037 16.4668C7.82825 16.9746 8.65921 16.9746 9.16715 16.4667L16.8449 8.78889L16.8451 2.46351C16.845 1.74528 16.2573 1.15768 15.539 1.15768Z"
          stroke="#666666"
          stroke-miterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.7689 5.71316C13.3604 6.12166 12.6981 6.12166 12.2896 5.71316C11.8811 5.30466 11.8811 4.64235 12.2896 4.23395C12.6981 3.82539 13.3604 3.82533 13.7689 4.23395C14.1774 4.64235 14.1774 5.30466 13.7689 5.71316Z"
          stroke="#666666"
          stroke-miterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default memo(TagIcon);
