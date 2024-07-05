import { SvgIcon } from "@mui/material";

const AccountProfileIcon = (props) => {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M10.0999 10.65C10.0416 10.6417 9.9666 10.6417 9.89994 10.65C8.43327 10.6 7.2666 9.39998 7.2666 7.92498C7.2666 6.41665 8.48327 5.19165 9.99993 5.19165C11.5083 5.19165 12.7333 6.41665 12.7333 7.92498C12.7249 9.39998 11.5666 10.6 10.0999 10.65Z"
          stroke={props.stroke || "#666666"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.6166 16.15C14.1333 17.5083 12.1666 18.3333 9.99997 18.3333C7.8333 18.3333 5.86663 17.5083 4.3833 16.15C4.46663 15.3667 4.96663 14.6 5.8583 14C8.14163 12.4833 11.875 12.4833 14.1416 14C15.0333 14.6 15.5333 15.3667 15.6166 16.15Z"
          stroke={props.stroke || "#666666"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z"
          stroke={props.stroke || "#666666"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default AccountProfileIcon;
