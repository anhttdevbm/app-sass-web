import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Dispatch, SetStateAction } from "react";
import {
  IHandleClickFormat,
  IToolBarDraftActionItem,
} from "../../../ToolBarDraftEditor";
import { Box, SelectChangeEvent, Typography } from "@mui/material";
import { uuid } from "utils/index";
import { DraftBlockType } from "draft-js";
import { CHECKABLE_LIST_ITEM } from "components/sn-docs/news/page-body/constants/draft.constants";

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
  {
    id: uuid(),
    label: "Check 1",
    style: "checked-one-list-item",
    method: "block",
    icon: <TaskAltIcon />,
  },
  {
    id: uuid(),
    label: "Check 2",
    style: "checked-two-list-item",
    method: "block",
    icon: <TaskAltIcon />,
  },
];

export default function AddSessionMenuList({
  anchorEl,
  setAnchorEl,
  handleClickChecked,
  focusEditor,
  handleClickFormatType,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  handleClickChecked?: (type: DraftBlockType) => void;
  handleClickFormatType?: (
    e:
      | React.MouseEvent<HTMLLIElement>
      | SelectChangeEvent
      | React.MouseEvent<HTMLButtonElement>,
    typeClick: IHandleClickFormat,
  ) => void;
  focusEditor?: () => void;
}) {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (
    event: React.MouseEvent<HTMLLIElement> | undefined,
    item: IToolBarDraftActionItem,
  ) => {
    setAnchorEl(null);
    switch (item.label) {
      case "Check 1":
        if (handleClickChecked) {
          handleClickChecked(CHECKABLE_LIST_ITEM);
        }
        if (focusEditor) focusEditor();
        return;
      case "Large Heading":
        if (handleClickFormatType) {
          setTimeout(() => {
            handleClickFormatType(event as React.MouseEvent<HTMLLIElement>, {
              method: item.method,
              style: item.style,
            });
          }, 0);
        }
        return;
      case "Small Heading":
        if (handleClickFormatType) {
          setTimeout(() => {
            handleClickFormatType(event as React.MouseEvent<HTMLLIElement>, {
              method: item.method,
              style: item.style,
            });
          }, 0);
        }
        return;
      case "Bullet 1":
        if (handleClickFormatType) {
          setTimeout(() => {
            handleClickFormatType(event as React.MouseEvent<HTMLLIElement>, {
              method: item.method,
              style: item.style,
            });
          }, 0);
        }
        return;
      case "Number":
        if (handleClickFormatType) {
          setTimeout(() => {
            handleClickFormatType(event as React.MouseEvent<HTMLLIElement>, {
              method: item.method,
              style: item.style,
            });
          }, 0);
        }
        return;
      default:
        break;
    }
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
        borderRadius: "10px",
      }}
    >
      {addSessionItems.map((item) => (
        <MenuItem
          sx={{ pl: 2, pr: 6 }}
          key={item.id}
          onClick={(event) => handleClickItem(event, item)}
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
