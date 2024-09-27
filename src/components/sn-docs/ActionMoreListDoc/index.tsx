import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Menu, MenuItem, SxProps } from "@mui/material";
import { NS_DOCS } from "constant/index";
import MoveArrowIcon from "icons/MoveArrowIcon";
import ThreeDotsIcon from "icons/ThreeDotsIcon";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDocs } from "store/docs/selectors";
import { IDocItem } from "../KanbanViewDocList";
import ConfirmChangeModal from "./ConfirmChangeModal";
import useActionMoreListDoc from "./hooks/useActionMoreListDoc";
import { useDeleteDocMutation } from "store/docs/api";
import ConfirmModal from "../detail/LeftSlide/modal/ConfirmModal";
import { useSnackbar } from "store/app/selectors";

interface IStyleActionMoreListDoc {
  colorIcon: string;
}

export default function ActionMoreListDoc({
  style,
  docItem,
  isHor,
  iconStyles,
}: {
  style?: IStyleActionMoreListDoc;
  docItem: IDocItem;
  isHor?: boolean;
  iconStyles?: SxProps;
}) {
  const docsT = useTranslations(NS_DOCS);

  const { onAddSnackbar } = useSnackbar();
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
  const { onCreateDoc, handleGetDocDetail } = useDocs();
  // This is for confirm Move Project
  const [isOpenConfirmMove, setIsOpenConfirmMove] = useState(false);
  // This is for simple confirm
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [deleteDoc] = useDeleteDocMutation();

  const onMoveDoc = () => {
    setIsOpenConfirmMove(true);
  };

  const onCloseConfirmMove = () => {
    setIsOpenConfirmMove(false);
  };

  const onOpenConfirm = () => {
    setIsOpenConfirm(true);
  };

  const onCloseConfirm = () => {
    setIsOpenConfirm(false);
  };

  const onDeleteDoc = () => {
    deleteDoc(docItem.id)
      .unwrap()
      .then(() => {
        onAddSnackbar("Xóa document thành công", "success");
        onCloseConfirm();
      })
      .catch((e) => {
        onAddSnackbar(e.data.errors[0].message, "error");
        onCloseConfirm();
      });
  };

  const onDupilcateDoc = async () => {
    const docDetail = await handleGetDocDetail(docItem.id);
    onCreateDoc(
      docDetail?.project_id,
      docDetail?.content,
      docDetail?.name,
      docDetail?.description,
    );
  };
  return (
    <>
      {isOpenConfirm && (
        <ConfirmModal
          content="This document will be deleted, and you won't be able to view it."
          onClose={onCloseConfirm}
          onConfirm={onDeleteDoc}
          open={isOpenConfirm}
          title="Are you sure to delete?"
          buttonTitle="Confirm"
        />
      )}
      {docItem && isOpenConfirmMove && (
        <ConfirmChangeModal
          open={isOpenConfirmMove}
          onClose={onCloseConfirmMove}
          docItem={docItem}
        />
      )}
      <IconButton
        aria-label="settings"
        sx={{
          zIndex: 1,
          padding: 0,
          marginRight: 1,
          width: "100%",
          height: "100%",
          "&:hover": { bgcolor: "transparent" },
          justifyContent: "end",
        }}
        onClick={(event) => {
          event.stopPropagation();
          handleClick(event);
        }}
      >
        <ThreeDotsIcon
          sx={{
            color: style?.colorIcon ?? "common.white",
            height: 18,
            width: 18,
            rotate: "90deg",
            ...iconStyles,
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
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
        {docItem?.project_id && (
          <MenuItem
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            onClick={onMoveDoc}
          >
            <MoveArrowIcon sx={{ height: 15, width: 15, color: "grey.400" }} />{" "}
            {docsT("extendBtn.moveProject") || "Move Project"}
          </MenuItem>
        )}
        <MenuItem
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={onDupilcateDoc}
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
          onClick={onOpenConfirm}
        >
          <DeleteOutlineIcon sx={{ height: 15, width: 15 }} />{" "}
          {docsT("extendBtn.delete")}
        </MenuItem>
      </Menu>
    </>
  );
}
