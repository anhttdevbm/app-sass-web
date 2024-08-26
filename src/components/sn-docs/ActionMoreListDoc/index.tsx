import { MoreHoriz } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslations } from "next-intl";
import { NS_DOCS } from "constant/index";
import useActionMoreListDoc from "./hooks/useActionMoreListDoc";
import MoveArrowIcon from "icons/MoveArrowIcon";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IDocItem } from "../KanbanViewDocList";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface IStyleActionMoreListDoc {
  colorIcon: string;
}

export default function ActionMoreListDoc({
  style,
  docItem,
  isHor,
}: {
  style?: IStyleActionMoreListDoc;
  docItem?: IDocItem;
  isHor?: boolean;
}) {
  const docsT = useTranslations(NS_DOCS);
  const {
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleRenameDoc,
    handleMoveDoc,
    handleDuplicateDoc,
    handleDeleteDoc,
  } = useActionMoreListDoc();
  return (
    <>
      <IconButton
        aria-label="settings"
        sx={{
          zIndex: 1,
          padding: 0,
          marginRight: 1,
          "&:hover": { bgcolor: "transparent" },
        }}
        onClick={(event) => {
          event.stopPropagation();
          handleClick(event);
        }}
      >
        {isHor ? (
          <MoreVertIcon
            sx={{
              color: style?.colorIcon ?? "common.white",
              height: 18,
              width: 18,
            }}
          />
        ) : (
          <MoreHoriz
            sx={{
              color: style?.colorIcon ?? "common.white",
              height: 18,
              width: 18,
            }}
          />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          sx: {
            width: 193,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* <MenuItem
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={() => handleRenameDoc(docItem?._id)}
        >
          <ContentPasteGoIcon
            sx={{ height: 15, width: 15, color: "grey.400" }}
          />{" "}
          {docsT("extendBtn.rename")}
        </MenuItem> */}
        <MenuItem
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={handleMoveDoc}
        >
          <MoveArrowIcon sx={{ height: 15, width: 15, color: "grey.400" }} />{" "}
          {docsT("extendBtn.move")}
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={handleDuplicateDoc}
        >
          <ContentCopyIcon sx={{ height: 15, width: 15, color: "grey.400" }} />{" "}
          {docsT("extendBtn.duplicate")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#DE360E",
          }}
          onClick={handleDeleteDoc}
        >
          <DeleteOutlineIcon sx={{ height: 15, width: 15 }} />{" "}
          {docsT("extendBtn.delete")}
        </MenuItem>
      </Menu>
    </>
  );
}
