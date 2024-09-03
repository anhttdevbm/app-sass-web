import React, { ReactNode } from "react";
import { Box, Button, Stack, SvgIconTypeMap, Typography } from "@mui/material";
import Popper from "@mui/material/Popper";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface ICustomDropdown {
  handleClose: () => void;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: null | HTMLElement;
  children: JSX.Element;
  icon?: ReactNode;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "right"
    | "right-start"
    | "right-end"
    | "left"
    | "left-start"
    | "left-end";
}
const CustomDropdown = React.memo(
  ({
    handleClose,
    handleClick,
    anchorEl,
    children,
    icon,
    placement,
  }: ICustomDropdown) => {
    const open = Boolean(anchorEl);
    const id = open ? "simple-popper" : undefined;
    return (
      <ClickAwayListener onClickAway={handleClose}>
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          {icon && icon}
          <Popper id={id} open={open} anchorEl={anchorEl} placement={placement}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              gap={"10px"}
              sx={{
                p: 1,
                background: "#F2FAFF",
                borderRadius: "4px",
                border: "solid 1px #EFEFEF",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </Stack>
          </Popper>
        </div>
      </ClickAwayListener>
    );
  },
);
export default CustomDropdown;
