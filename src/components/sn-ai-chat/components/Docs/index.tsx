import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDocs } from "store/docs/selectors";

export const AddDocModal = ({ open, onClose }) => {
  const { onCreateDoc, onGetDocs, handleUpdateDoc } = useDocs();
  const [search, setSearch] = React.useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleAddDoc = async () => {
    const doc = await onCreateDoc(search);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Add Document
        <IconButton
          style={{ position: "absolute", right: 0, top: 0 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Search"
          value={search}
          onChange={handleSearchChange}
          fullWidth
        />
        <List>
          {/* Replace this with your list of documents */}
          <ListItem>Document 1</ListItem>
          <ListItem>Document 2</ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddDoc} color="primary">
          Add Doc
        </Button>
      </DialogActions>
    </Dialog>
  );
};
