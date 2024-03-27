import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const UploadFileIcon = (props: SvgIconProps) => {
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
        d="M10.586 6.34269L12.7073 4.22137C13.1716 3.75708 13.7228 3.38878 14.3295 3.13751C14.9361 2.88623 15.5863 2.75691 16.2429 2.75691C16.8995 2.75691 17.5497 2.88624 18.1563 3.13751C18.7629 3.38878 19.3141 3.75708 19.7784 4.22137C20.2427 4.68567 20.611 5.23686 20.8623 5.84349C21.1135 6.45012 21.2429 7.1003 21.2429 7.75691C21.2429 8.41352 21.1135 9.0637 20.8623 9.67032C20.611 10.277 20.2427 10.8281 19.7784 11.2924L17.6571 13.4138M13.4144 17.6564L11.2931 19.7777C10.8288 20.242 10.2776 20.6103 9.67101 20.8616C9.06438 21.1129 8.4142 21.2422 7.75759 21.2422C6.43151 21.2422 5.15974 20.7154 4.22206 19.7777C3.28438 18.84 2.75759 17.5683 2.75759 16.2422C2.75759 14.9161 3.28438 13.6443 4.22206 12.7067L6.34338 10.5853"
        stroke="#999999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.17188 14.8281L14.8287 9.17127"
        stroke="#999999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default memo(UploadFileIcon);
