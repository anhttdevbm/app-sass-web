import { SvgIconProps } from "@mui/material";
import { SvgIcon } from "components/shared";

const KnowledgeIcon = (props: SvgIconProps) => {
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
        d="M5.04883 12.75V7.25C5.04883 5.25 5.54883 4.75 7.54883 4.75H11.0488C13.0488 4.75 13.5488 5.25 13.5488 7.25V12.25C13.5488 12.32 13.5488 12.39 13.5438 12.46"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.47383 11.25H13.5488V13C13.5488 13.965 12.7638 14.75 11.7988 14.75H6.79883C5.83383 14.75 5.04883 13.965 5.04883 13V12.675C5.04883 11.89 5.68883 11.25 6.47383 11.25Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.29883 7.25H11.2988"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.29883 9H9.79883"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default KnowledgeIcon;
