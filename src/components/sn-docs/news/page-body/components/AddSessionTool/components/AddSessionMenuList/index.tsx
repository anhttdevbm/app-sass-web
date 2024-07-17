import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";

import { Dispatch, SetStateAction } from "react";
import { IToolBarDraftActionItem } from "../../../ToolBarDraftEditor";
import { Box, Typography } from "@mui/material";
import { uuid } from "utils/index";

const addSessionItems: IToolBarDraftActionItem[] = [
  {
    id: uuid(),
    label: "Large Heading",
    style: "header-one",
    method: "block",
    icon: <Typography>H1</Typography>,
  },
  {
    id: uuid(),
    label: "Small Heading",
    style: "header-two",
    method: "block",
    icon: <Typography>H2</Typography>,
  },
  {
    id: uuid(),
    label: "Bullet 1",
    style: "unordered-list-item",
    method: "block",
    icon: <FormatListBulletedIcon />,
  },
  {
    id: uuid(),
    label: "Number",
    style: "ordered-list-item",
    method: "block",
    icon: <FormatListNumberedIcon />,
  },
];

export default function AddSessionMenuList({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}) {
  const open = Boolean(anchorEl);

  const handleClose = (item: IToolBarDraftActionItem) => {
    setAnchorEl(null);
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      sx={{
        minWidth: "16.75rem",
        borderRadius: "10px"
      }}
    >
      {addSessionItems.map((item) => (
        <MenuItem
          sx={{ pl: 2, pr: 6 }}
          key={item.id}
          onClick={() => handleClose(item)}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            {item.icon}
            <Typography>{item.label}</Typography>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );
}
