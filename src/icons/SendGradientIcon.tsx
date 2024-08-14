import { SvgIconProps } from "@mui/material";
import { SvgIcon } from "components/shared";

const SendGradientIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.28586 4.67573L9.28617 4.67588L17.8462 8.95588C19.6937 9.87963 20.4498 11.0113 20.4498 11.9987C20.4498 12.986 19.6937 14.1177 17.8462 15.0415L9.28617 19.3215C7.87636 20.0264 6.71145 20.3914 5.81015 20.4773C4.90671 20.5634 4.33719 20.3657 4.00856 20.0366C3.67988 19.7075 3.48284 19.1376 3.56967 18.2345C3.65628 17.3337 4.0219 16.1701 4.72667 14.7629C4.72673 14.7628 4.72678 14.7627 4.72683 14.7626L5.59647 13.0333L5.59649 13.0333L5.59874 13.0287C5.91679 12.3799 5.91679 11.6274 5.59874 10.9786L5.59875 10.9786L5.59699 10.9751L4.72699 9.23506L4.72683 9.23475C4.02201 7.82756 3.657 6.66397 3.57111 5.76324C3.48503 4.86042 3.68271 4.29034 4.01208 3.96097C4.34145 3.63161 4.91152 3.43392 5.81435 3.52001C6.71508 3.60589 7.87867 3.97091 9.28586 4.67573ZM9.43977 13.2487H14.8398C15.5259 13.2487 16.0898 12.6848 16.0898 11.9987C16.0898 11.3125 15.5259 10.7487 14.8398 10.7487H9.43977C8.75363 10.7487 8.18977 11.3125 8.18977 11.9987C8.18977 12.6848 8.75363 13.2487 9.43977 13.2487Z"
        fill="url(#paint0_linear_1660_12330)"
        stroke="url(#paint1_linear_1660_12330)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1660_12330"
          x1="4.06896"
          y1="16.9979"
          x2="20.3858"
          y2="16.8952"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0575E6" />
          <stop offset="1" stopColor={props.fill || "#38E27B"}/>
        </linearGradient>
        <linearGradient
          id="paint1_linear_1660_12330"
          x1="4.06896"
          y1="16.9979"
          x2="20.3858"
          y2="16.8952"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0575E6" />
          <stop offset="1" stopColor={props.fill || "#38E27B"} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default SendGradientIcon;
