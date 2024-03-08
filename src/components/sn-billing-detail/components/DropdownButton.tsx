import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { NS_BILLING } from "constant/index";
import { useTranslations } from "next-intl";
import { ButtonBase, Menu, Stack } from "@mui/material";
import { Text } from "components/shared";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";

type Props = {
  handleOpen: (value) => void;
};
const ITEM_HEIGHT = 48;

export const DropdownButton = (props: Props) => {
  const { handleOpen } = props;
  // const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const billingT = useTranslations(NS_BILLING);

  const options = [
    billingT("detail.form.top.button.addPayment"),
    billingT("detail.form.top.button.addWriteOff"),
  ];

  // const handleClick = () => {
  //   console.info(`You clicked ${options[selectedIndex]}`);
  // };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    // setOpen(false);
  };

  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  // const handleClose = (event: Event) => {
  //   if (
  //     anchorRef.current &&
  //     anchorRef.current.contains(event.target as HTMLElement)
  //   ) {
  //     return;
  //   }

  //   setOpen(false);
  // };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      {/* <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHoriz />
      </IconButton> */}
      <Button
        onClick={handleClick}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        variant="contained"
        size="medium"
      >
        {options[selectedIndex]}
      </Button>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "12ch",
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 2}
            selected={index === selectedIndex}
            onClick={(event) => {
              handleMenuItemClick(event, index);
              if (
                options[index] == billingT("detail.form.top.button.addWriteOff")
              ) {
                handleOpen("write");
              } else {
                handleOpen("add");
              }
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      {/* <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button
          onClick={() => {
            if (
              options[selectedIndex] ==
              billingT("detail.form.top.button.addWriteOff")
            ) {
              handleOpen("write");
            } else {
              handleOpen("add");
            }
          }}
        >
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 4,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper> */}
    </React.Fragment>
  );
};

export default DropdownButton;
