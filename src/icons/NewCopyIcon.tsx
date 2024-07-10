import { SvgIcon, SvgIconProps } from "@mui/material";

const NewCopyIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}
      width="15"
      height="17"
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.25.25H2C1.175.25.5.925.5 1.75v9.75c0 .412.338.75.75.75.413 0 .75-.338.75-.75v-9c0-.413.337-.75.75-.75h7.5c.412 0 .75-.337.75-.75a.752.752 0 0 0-.75-.75Zm3 3H5c-.825 0-1.5.675-1.5 1.5v10.5c0 .825.675 1.5 1.5 1.5h8.25c.825 0 1.5-.675 1.5-1.5V4.75c0-.825-.675-1.5-1.5-1.5Zm-.75 12H5.75A.752.752 0 0 1 5 14.5v-9c0-.412.338-.75.75-.75h6.75c.412 0 .75.338.75.75v9c0 .412-.338.75-.75.75Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default NewCopyIcon;
