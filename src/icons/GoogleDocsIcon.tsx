import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

function GoogleDocsIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_856_136303"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="4"
        y="2"
        width="16"
        height="20"
      >
        <path
          d="M19.0397 2.40039H4.7998V21.9802H19.0397V2.40039Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_856_136303)">
        <path
          d="M13.7029 2.39844H6.13729C5.42615 2.39844 4.80273 3.02107 4.80273 3.73377V20.6436C4.80273 21.3555 5.42537 21.979 6.13807 21.979H17.7081C18.42 21.979 19.0434 21.3563 19.0434 20.6436V7.73822L15.9287 5.51318L13.7029 2.39844Z"
          fill="#4285F4"
        />
        <path
          d="M8.3623 16.6376H15.4823V15.7478H8.3631L8.3623 16.6376ZM8.3623 18.4177H13.7021V17.5281H8.3623V18.4177ZM8.3623 12.1875V13.0772H15.4823V12.1875H8.3623ZM8.3623 14.8573H15.4823V13.9677H8.3631L8.3623 14.8573Z"
          fill="#F1F1F1"
        />
        <path
          d="M13.7026 2.39844V6.40366C13.7026 7.11558 14.3253 7.73822 15.0372 7.73822H19.0424L13.7026 2.39844Z"
          fill="#A1C2FA"
        />
      </g>
    </SvgIcon>
  );
}

export default GoogleDocsIcon;
