import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const CaretIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 25 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.91421 10C9.02331 10 8.57714 11.0771 9.20711 11.7071L11.7929 14.2929C12.1834 14.6834 12.8166 14.6834 13.2071 14.2929L15.7929 11.7071C16.4229 11.0771 15.9767 10 15.0858 10H9.91421Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default memo(CaretIcon);
