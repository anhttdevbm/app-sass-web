import { SvgIcon, SvgIconProps } from "@mui/material";

const YoutubeGradientIcon = (props: SvgIconProps) => {
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
        d="M14.167 3.33203H5.83366C3.33366 3.33203 1.66699 4.9987 1.66699 7.4987V12.4987C1.66699 14.9987 3.33366 16.6654 5.83366 16.6654H14.167C16.667 16.6654 18.3337 14.9987 18.3337 12.4987V7.4987C18.3337 4.9987 16.667 3.33203 14.167 3.33203ZM11.5753 10.857L9.51698 12.0904C8.68364 12.5904 8.00031 12.207 8.00031 11.232V8.75704C8.00031 7.78204 8.68364 7.39871 9.51698 7.89871L11.5753 9.13202C12.367 9.61536 12.367 10.382 11.5753 10.857Z"
        fill="url(#paint0_linear_978_100974)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_978_100974"
          x1="2.61636"
          y1="13.7024"
          x2="17.8082"
          y2="13.5822"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0575E6" />
          <stop offset="1" stopColor="#38E27B" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default YoutubeGradientIcon;
