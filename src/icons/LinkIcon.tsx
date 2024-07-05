import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const LinkIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_3692_61567)">
        <path
          d="M12.4999 5.83398H14.9999C15.5471 5.83398 16.0889 5.94176 16.5944 6.15115C17.1 6.36055 17.5593 6.66746 17.9462 7.05437C18.3331 7.44128 18.64 7.90061 18.8494 8.40614C19.0588 8.91166 19.1666 9.45348 19.1666 10.0007C19.1666 10.5478 19.0588 11.0896 18.8494 11.5952C18.64 12.1007 18.3331 12.56 17.9462 12.9469C17.5593 13.3338 17.1 13.6408 16.5944 13.8501C16.0889 14.0595 15.5471 14.1673 14.9999 14.1673H12.4999M7.49992 14.1673H4.99992C4.45274 14.1673 3.91093 14.0595 3.4054 13.8501C2.89988 13.6408 2.44055 13.3338 2.05364 12.9469C1.27224 12.1655 0.833252 11.1057 0.833252 10.0007C0.833252 8.89558 1.27224 7.83577 2.05364 7.05437C2.83504 6.27297 3.89485 5.83398 4.99992 5.83398H7.49992"
          stroke="#666666"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66675 10H13.3334"
          stroke="#666666"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3692_61567">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
};

export default memo(LinkIcon);
