import {
  MenuItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  SvgIconProps,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const PresetMenuItem = (props: {
  preset: string;
  type: "prompt" | "command";
  onClick?: () => void;
  isLoading?: boolean;
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <MenuItem
      sx={{
        "&:hover": {
          backgroundColor: "#ece6fd !important",
        },
        bgcolor: props.isLoading ? "#ece6fd !important" : "transparent",
        borderRadius: 2,
      }}
      onClick={props.onClick}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <ListItemIcon>
        {isHover || props.isLoading ? (
          <PromptPresetHoverIcon sx={{ color: "transparent" }} />
        ) : (
          <PromptPresetIcon sx={{ color: "transparent" }} />
        )}
      </ListItemIcon>
      <ListItemText sx={{ whiteSpace: "normal" }}>
        {props.preset}
        {props.type === "prompt" ? "..." : ""}
      </ListItemText>
      {isHover && !props.isLoading && (
        <EnterIcon sx={{ color: "transparent" }} />
      )}
      {props.isLoading && <CircularProgress />}
    </MenuItem>
  );
};

export default PresetMenuItem;

const PromptPresetIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.6466 5.39572L12.0068 6.0355L10.7139 4.7426L11.3537 4.10282C11.5347 3.92188 11.7651 3.83594 12.0002 3.83594C12.2352 3.83594 12.4657 3.92188 12.6466 4.10282C13.0047 4.4609 13.0047 5.03765 12.6466 5.39572Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M10.8329 7.21468L3.98007 14.0611L3.9799 14.0613C3.62183 14.4194 3.04508 14.4194 2.68701 14.0613C2.32899 13.7033 2.32894 13.1266 2.68685 12.7686C2.68687 12.7685 2.6869 12.7685 2.68692 12.7685C2.68695 12.7685 2.68698 12.7684 2.68701 12.7684L9.53996 5.92179L10.8329 7.21468Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M6.15393 2.94091L6.11236 3.08186L6.15366 3.22289L6.29741 3.71373L5.8083 3.56946L5.66906 3.52839L5.52948 3.56827L5.03661 3.70909L5.17975 3.22382L5.22082 3.08459L5.18094 2.94501L5.04012 2.45214L5.52538 2.59527L5.66684 2.637L5.8083 2.59527L6.29854 2.45067L6.15393 2.94091Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M3.48694 6.94091L3.44558 7.08114L3.48628 7.22157L3.62731 7.70812L3.13464 7.5628L2.99318 7.52107L2.85172 7.5628L2.37094 7.70461L2.51275 7.22382L2.55382 7.08459L2.51394 6.94501L2.37312 6.45214L2.85839 6.59527L2.99763 6.63634L3.13721 6.59646L3.63008 6.45564L3.48694 6.94091Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M13.4869 10.2752L13.4445 10.4189L13.4881 10.5622L13.6337 11.0403L13.1479 10.8971L13.0065 10.8553L12.865 10.8971L12.3842 11.0389L12.5261 10.5581L12.5678 10.4166L12.5261 10.2752L12.3842 9.7944L12.865 9.93621L13.0065 9.97793L13.1479 9.93621L13.6287 9.7944L13.4869 10.2752Z"
      fill="#666666"
      stroke="#666666"
    />
  </SvgIcon>
);

const PromptPresetHoverIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.6466 4.9465L12.0068 5.58628L10.7139 4.29339L11.3537 3.65361C11.5347 3.47266 11.7651 3.38672 12.0002 3.38672C12.2352 3.38672 12.4657 3.47266 12.6466 3.65361C13.0047 4.01168 13.0047 4.58843 12.6466 4.9465Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M10.8329 6.76546L3.98007 13.6119L3.9799 13.6121C3.62183 13.9701 3.04508 13.9701 2.68701 13.6121C2.32899 13.2541 2.32894 12.6774 2.68685 12.3193C2.68687 12.3193 2.6869 12.3193 2.68692 12.3193C2.68695 12.3192 2.68698 12.3192 2.68701 12.3192L9.53996 5.47257L10.8329 6.76546Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M6.15393 2.49169L6.11236 2.63264L6.15366 2.77368L6.29741 3.26451L5.8083 3.12024L5.66906 3.07917L5.52948 3.11905L5.03661 3.25987L5.17975 2.77461L5.22082 2.63537L5.18094 2.49579L5.04012 2.00292L5.52538 2.14606L5.66684 2.18778L5.8083 2.14606L6.29854 2.00145L6.15393 2.49169Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M3.48694 6.49169L3.44558 6.63192L3.48628 6.77235L3.62731 7.2589L3.13464 7.11358L2.99318 7.07185L2.85172 7.11358L2.37094 7.25539L2.51275 6.77461L2.55382 6.63537L2.51394 6.49579L2.37312 6.00292L2.85839 6.14606L2.99763 6.18713L3.13721 6.14724L3.63008 6.00642L3.48694 6.49169Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M13.4869 9.82596L13.4445 9.96967L13.4881 10.113L13.6337 10.5911L13.1479 10.4478L13.0065 10.4061L12.865 10.4478L12.3842 10.5897L12.5261 10.1089L12.5678 9.96742L12.5261 9.82596L12.3842 9.34518L12.865 9.48699L13.0065 9.52872L13.1479 9.48699L13.6287 9.34518L13.4869 9.82596Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
  </SvgIcon>
);

const EnterIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.94141 15.5599H12.6081C14.9081 15.5599 16.7747 13.6932 16.7747 11.3932C16.7747 9.09323 14.9081 7.22656 12.6081 7.22656H3.44141"
      stroke="#666666"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5.35794 9.30964L3.22461 7.1763L5.35794 5.04297"
      stroke="#666666"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </SvgIcon>
);
