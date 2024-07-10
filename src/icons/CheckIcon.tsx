import { SvgIcon, SvgIconProps } from "@mui/material";

const CheckIcon = (props: SvgIconProps) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.4089 5.01883C15.6633 5.27309 15.6633 5.68535 15.4089 5.93962L8.24687 13.1017C7.9926 13.356 7.58035 13.356 7.32608 13.1017L4.07058 9.84619C3.81632 9.59194 3.81632 9.17965 4.07058 8.92542C4.32485 8.67115 4.73711 8.67115 4.99138 8.92542L7.78648 11.7205L14.4881 5.01883C14.7425 4.76456 15.1547 4.76456 15.4089 5.01883Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CheckIcon;
