import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const CircleUnchecked = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 22.25C6.34614 22.25 1.75 17.6539 1.75 12C1.75 6.34614 6.34614 1.75 12 1.75C17.6539 1.75 22.25 6.34614 22.25 12C22.25 17.6539 17.6539 22.25 12 22.25ZM12 2.25C6.62386 2.25 2.25 6.62386 2.25 12C2.25 17.3761 6.62386 21.75 12 21.75C17.3761 21.75 21.75 17.3761 21.75 12C21.75 6.62386 17.3761 2.25 12 2.25Z"
        fill="#292D32"
        stroke="#999999"
      />
    </SvgIcon>
  );
};

export default memo(CircleUnchecked);
