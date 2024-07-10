import { SvgIcon, SvgIconProps } from "@mui/material";

const ThreeDotsIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}
      width="4"
      height="16"
      viewBox="0 0 4 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm0 2C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default ThreeDotsIcon;
