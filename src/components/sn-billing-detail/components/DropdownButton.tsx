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
import { Box, ButtonBase, Menu, Stack } from "@mui/material";
import { Text } from "components/shared";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";

type Props = {
  handleOpen: (value) => void;
  selectedOps: number;
};
const ITEM_HEIGHT = 48;

export const DropdownButton = (props: Props) => {
  const { handleOpen, selectedOps } = props;
  // const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = React.useState(selectedOps ?? 0);
  const billingT = useTranslations(NS_BILLING);

  const options = ["Paid", "Write Off"];

  React.useEffect(() => {
    setSelectedIndex(selectedOps);
  }, [selectedOps]);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack sx={{ position: "relative" }}>
      <Box
        onClick={handleClick}
        sx={{
          width: "100%",
          padding: "10px 16px",
          backgroundColor: "#F9F1F169",
          borderRadius: "24px",
          border: "1px solid #EFEFEF",
        }}
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
      >
        <Box
          sx={{
            padding: "5px 20px",
            borderRadius: "24px",
            color: options[selectedIndex] === "Paid" ? "#0BB783" : "#FF2C56",
            backgroundColor:
              options[selectedIndex] === "Paid" ? "#E8F2EF" : "#FFD9E1",
            width: "fit-content",
          }}
        >
          {options[selectedIndex]}
        </Box>
      </Box>
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
        sx={{ position: "absolute", top: 0 }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 2}
            selected={index === selectedIndex}
            onClick={(event) => {
              handleMenuItemClick(event, index);
              if (options[index] == "Paid") {
                handleOpen("paid");
              } else {
                handleOpen("write");
              }
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default DropdownButton;
