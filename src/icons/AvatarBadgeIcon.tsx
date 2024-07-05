import { SvgIcon } from "@mui/material";

const AvatarBadgeIcon = (props) => {
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
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <circle
          cx="8"
          cy="8"
          r="6.5"
          fill="#0BB783"
          stroke="white"
          strokeWidth="3"
        />
      </svg>
    </SvgIcon>
  );
};

export default AvatarBadgeIcon;
