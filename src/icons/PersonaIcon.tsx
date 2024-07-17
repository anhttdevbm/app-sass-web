import { SvgIconProps, SvgIcon } from "@mui/material";

export default function PersonaIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.1331 9.36042C10.0498 9.35208 9.9498 9.35208 9.85814 9.36042C7.8748 9.29375 6.2998 7.66875 6.2998 5.66875C6.2998 3.62708 7.9498 1.96875 9.9998 1.96875C12.0415 1.96875 13.6998 3.62708 13.6998 5.66875C13.6915 7.66875 12.1165 9.29375 10.1331 9.36042Z"
        stroke="#3699FF"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.9666 12.4328C3.94993 13.7828 3.94993 15.9828 5.9666 17.3245C8.25827 18.8578 12.0166 18.8578 14.3083 17.3245C16.3249 15.9745 16.3249 13.7745 14.3083 12.4328C12.0249 10.9078 8.2666 10.9078 5.9666 12.4328Z"
        stroke="#3699FF"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
}
