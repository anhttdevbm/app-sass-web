import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslations } from "next-intl";
import { NS_DOCS } from "constant/index";
import { Box, Button, TextField, Typography } from "@mui/material";

export interface INewItemBoardBoxEditor {
  newName: string;
  newNameChild?: string;
}

export default function DialogEditBoardBoxEditorItem({
  open,
  setOpen,
  name,
  addConfirmAddDialog
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  name: string;
  addConfirmAddDialog: (val: INewItemBoardBoxEditor) => void;
}) {
  const docsT = useTranslations(NS_DOCS);
  const [newItem, setNewItem] = React.useState<INewItemBoardBoxEditor>({
    newName: name,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    addConfirmAddDialog(newItem);
    setOpen(false);
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, newName: event.target.value });
  };

  const onChangeNameChild = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, newNameChild: event.target.value });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {docsT("treeItemDialogEditTitle")}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography id="title-new-tree">
            {docsT("newTreeItemDialogLabel")}
          </Typography>
          <Box>
            <TextField
              defaultValue={name}
              onChange={onChangeName}
              label={docsT("treeName")}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography id="title-newTreeItemChildTitle">
              {docsT("addNewTreeItemChildTitle")}
            </Typography>
            <TextField
              onChange={onChangeNameChild}
              label={docsT("treeName")}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "blue.normal", backgroundColor: "unset" }}
            onClick={handleClose}
          >
            {docsT("button.cancel")}
          </Button>
          <Button
            sx={{
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              color: "common.white",
              borderRadius: "8px",
            }}
            onClick={handleConfirm}
            autoFocus
          >
            {docsT("button.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
