import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const ProfileCircleIcon = (props: SvgIconProps) => {
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
        d="M10.0999 10.6497C10.0416 10.6414 9.9666 10.6414 9.89994 10.6497C8.43327 10.5997 7.2666 9.39974 7.2666 7.92474C7.2666 6.41641 8.48327 5.19141 9.99993 5.19141C11.5083 5.19141 12.7333 6.41641 12.7333 7.92474C12.7249 9.39974 11.5666 10.5997 10.0999 10.6497Z"
        stroke="#666666"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6171 16.1508C14.1338 17.5091 12.1671 18.3341 10.0005 18.3341C7.83379 18.3341 5.86712 17.5091 4.38379 16.1508C4.46712 15.3674 4.96712 14.6008 5.85879 14.0008C8.14212 12.4841 11.8755 12.4841 14.1421 14.0008C15.0338 14.6008 15.5338 15.3674 15.6171 16.1508Z"
        stroke="#666666"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0003 18.3327C14.6027 18.3327 18.3337 14.6017 18.3337 9.99935C18.3337 5.39698 14.6027 1.66602 10.0003 1.66602C5.39795 1.66602 1.66699 5.39698 1.66699 9.99935C1.66699 14.6017 5.39795 18.3327 10.0003 18.3327Z"
        stroke="#666666"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default memo(ProfileCircleIcon);
