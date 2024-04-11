import * as React from "react";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 5,
  width: 17,
  height: 17,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#1BC5BD",
  boxShadow: "none",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 17,
    height: 17,
    backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiA1Yy0uMjggMC0uNTMuMTEtLjcxLjI5TDcgOS41OWwtMi4yOS0yLjNhMS4wMDMgMS4wMDMgMCAwIDAtMS40MiAxLjQybDMgM2MuMTguMTguNDMuMjkuNzEuMjlzLjUzLS4xMS43MS0uMjlsNS01QTEuMDAzIDEuMDAzIDAgMCAwIDEyIDV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+")',
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#1BC5BD",
  },
});

// Inspired by blueprintjs
function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{
        "&:hover": { bgcolor: "transparent" },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      {...props}
    />
  );
}
export default memo(BpCheckbox);
