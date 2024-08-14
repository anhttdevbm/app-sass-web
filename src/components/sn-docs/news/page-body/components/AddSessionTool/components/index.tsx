import {
  Box,
  Button,
  Menu,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import AddSessionMenuList from "./AddSessionMenuList";
import {
  DraftBlockType,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
} from "draft-js";
import {
  IHandleClickFormat,
  IToolBarDraftActionItem,
} from "../../ToolBarDraftEditor";
import { Map } from "immutable";
import { CHECKABLE_LIST_ITEM } from "../../../constants/draft.constants";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import SquareIcon from "@mui/icons-material/Square";
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
    label: "Check 1",
    style: "checked-one-list-item",
    method: "block",
    icon: <CheckBoxOutlinedIcon />,
  },
  {
    id: uuid(),
    label: "Check 2",
    style: "checked-two-list-item",
    method: "block",
    icon: <TaskAltIcon />,
  },
  {
    id: uuid(),
    label: "Check 3",
    style: "checked-heart-list-item",
    method: "block",
    icon: <FavoriteBorderOutlinedIcon />,
  },
  {
    id: uuid(),
    label: "Bullet 1",
    style: "unordered-list-item",
    method: "block",
    icon: <FiberManualRecordIcon />,
  },
  {
    id: uuid(),
    label: "Bullet 2",
    style: "triangle-list-item",
    method: "block",
    icon: <ChangeHistoryIcon />,
  },
  {
    id: uuid(),
    label: "Bullet 3",
    style: "square-list-item",
    method: "block",
    icon: <SquareIcon />,
  },
  {
    id: uuid(),
    label: "Number",
    style: "ordered-list-item",
    method: "block",
    icon: <FormatListNumberedIcon />,
  },
  // {
  //   id: uuid(),
  //   label: "Letter",
  //   style: "ordered-list-item",
  //   method: "block",
  //   icon: <FormatListNumberedIcon />,
  // },
];

export default function AddSessionTool({
  editorState,
  setEditorState,
  focusEditor,
  editor,
}: {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  focusEditor?: () => void;
  editor: MutableRefObject<Editor | null>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAddSession = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const applyStyle = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | SelectChangeEvent
      | React.MouseEvent<HTMLLIElement>
      | React.MouseEvent<HTMLDivElement>,
    typeClick: IHandleClickFormat,
  ) => {
    if (e && "currentTarget" in e) {
      e.preventDefault();
    }

    if (typeClick.style.startsWith("text-align-")) {
      // Xử lý căn lề
      const alignment = typeClick.style.replace("text-align-", "");
      const newContentState = Modifier.setBlockData(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        Map({ textAlign: alignment }),
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-data",
      );
      setEditorState(newEditorState);
    } else if (typeClick.method === "block") {
      // Xử lý các kiểu block khác (như H1, H2, ...)
      setEditorState(RichUtils.toggleBlockType(editorState, typeClick.style));
    } else {
      // Xử lý các kiểu inline
      setEditorState(RichUtils.toggleInlineStyle(editorState, typeClick.style));
    }
  };

  const createMouseDownHandler = (type: DraftBlockType) => {
    if (type === CHECKABLE_LIST_ITEM) {
      const newEditorState = RichUtils.toggleBlockType(
        editorState,
        CHECKABLE_LIST_ITEM,
      );
      setEditorState(newEditorState);
    } else {
      toggleBlockType(type);
    }
    setTimeout(() => {
      editor.current?.focus();
    }, 0);
  };

  const toggleBlockType = (type: DraftBlockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));

    setTimeout(() => {
      editor.current?.focus();
    }, 0);
  };

  const handleClickItem = (
    event: React.MouseEvent<HTMLDivElement> | undefined,
    item: IToolBarDraftActionItem,
  ) => {
    setAnchorEl(null);
    switch (item.label) {
      case "Large Heading":
        setTimeout(() => {
          applyStyle(event as React.MouseEvent<HTMLDivElement>, {
            method: item.method,
            style: item.style,
          });
        }, 0);
        return;
      case "Small Heading":
        setTimeout(() => {
          applyStyle(event as React.MouseEvent<HTMLDivElement>, {
            method: item.method,
            style: item.style,
          });
        }, 0);
        return;
      case "Bullet 1":
        setTimeout(() => {
          applyStyle(event as React.MouseEvent<HTMLDivElement>, {
            method: item.method,
            style: item.style,
          });
        }, 0);
        return;
      case "Number":
        setTimeout(() => {
          applyStyle(event as React.MouseEvent<HTMLDivElement>, {
            method: item.method,
            style: item.style,
          });
        }, 0);
        return;
      default:
        break;
    }
  };

  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
        py={2}
      >
        {/* Thêm đường kẻ ngang */}
        <Box
          position="absolute"
          top="50%"
          left={0}
          right={0}
          height="1px"
          bgcolor="#EFEFEF"
          zIndex={0}
        />
        <Box
          alignItems="center"
          sx={{ backgroundColor: "common.white" }}
          px={2}
          zIndex={1}
          aria-haspopup="true"
        >
          <Button
            disableRipple
            onClick={handleClickAddSession}
            sx={{
              display: "flex",
              cursor: "pointer",
              p: "8px",
              textTransform: "none",
              position: "relative",
            }}
          >
            <Box
              borderRadius="9999px"
              sx={{
                width: "24px",
                height: "24px",
                backgroundImage: "linear-gradient(to right, #2AF598, #009EFD)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              mr={0.5}
            >
              <AddIcon
                sx={{ width: "18px", height: "18px", color: "common.white" }}
              />
            </Box>
            <Typography>Add session</Typography>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{
              minWidth: {sm: "16.75rem"},
              maxWidth: {xs: "13.75rem"},
              maxHeight: {xs: "20.4375rem"},
              overFlowY: {xs: "auto"},
              borderRadius: "10px",
            }}
            disableAutoFocusItem
            TransitionProps={{
              onExited: () => {
                // Xử lý khi menu đã đóng hoàn toàn
                if (focusEditor) focusEditor();
              },
            }}
          >
            {addSessionItems.map((item) => (
              <MenuItem
                component="div"
                disableRipple
                sx={{ pl: 2, pr: 6 }}
                key={item.id}
              >
                {item.label === "Check 1" ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                    onMouseDown={() => {
                      setAnchorEl(null);
                      createMouseDownHandler(CHECKABLE_LIST_ITEM);
                    }}
                  >
                    {item.icon}
                    <Typography>{item.label}</Typography>
                  </Box>
                ) : (
                  <Box
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      event.preventDefault();
                      handleClickItem(event, item);
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {item.icon}
                    <Typography>{item.label}</Typography>
                  </Box>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </>
  );
}
