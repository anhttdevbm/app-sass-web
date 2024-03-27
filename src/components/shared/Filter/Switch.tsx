/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import FormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";

type IProps = Omit<FormControlLabelProps, "control">;

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 48,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    transform: "translateX(4px) translateY(2px)",
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(24px) translateY(2px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "red",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const FilterSwitch: React.FC<IProps> = ({
  labelPlacement = "start",
  label,
  sx,
  ...props
}) => {
  const isDarkMode = false;
  return (
    <FormControlLabel
      label={label}
      labelPlacement={labelPlacement}
      {...props}
      control={<IOSSwitch sx={{ m: 1 }} />}
      sx={{
        " .MuiTypography-root": {
          fontSize: "14px",
          fontWeight: 600,
          color: isDarkMode ? "#ECECEC" : "rgba(102, 102, 102, 1)",
          userSelect: "none",
        },
        ...sx,
      }}
    />
  );
};

export default FilterSwitch;
