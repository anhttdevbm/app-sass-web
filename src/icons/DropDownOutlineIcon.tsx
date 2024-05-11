import { SvgIconProps } from "@mui/material";
import { SvgIcon } from "components/shared";

export const DropDownOutlineIcon = (props: SvgIconProps) => {
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
        d="M9.99977 14.0005C9.41644 14.0005 8.83311 13.7755 8.39144 13.3339L2.95811 7.90052C2.71644 7.65885 2.71644 7.25885 2.95811 7.01719C3.19977 6.77552 3.59977 6.77552 3.84144 7.01719L9.27477 12.4505C9.67477 12.8505 10.3248 12.8505 10.7248 12.4505L16.1581 7.01719C16.3998 6.77552 16.7998 6.77552 17.0414 7.01719C17.2831 7.25885 17.2831 7.65885 17.0414 7.90052L11.6081 13.3339C11.1664 13.7755 10.5831 14.0005 9.99977 14.0005Z"
        fill={props.fill || "#666666"}
      />
    </SvgIcon>
  );
};
