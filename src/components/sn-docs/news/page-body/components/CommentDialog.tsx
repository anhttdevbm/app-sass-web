"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Avatar from "components/Avatar";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useAuth } from "store/app/selectors";
import { usePostCommentMutation } from "store/docs/api";
import { NewPageContext } from "../../context/NewPageContext";
import useDocEditor from "../../hook/useDocEditor";
import { useParams } from "next/navigation";

export class Comment {
  content: string;
  position: string;
  constructor(content) {
    this.content = content;
    this.position = `a${crypto.randomUUID()}a`;
  }
}

export default function CommentDialog() {
  const { openCommentDialog, setCommentDialogOpen, setActiveCommentId } =
    React.useContext(NewPageContext);
  const { user } = useAuth();
  const t = useTranslations(NS_DOCS);
  const [addComment] = usePostCommentMutation();
  const [comment, setComment] = React.useState<string>("");
  const { id } = useParams();

  const editor = useDocEditor();
  const handleClose = () => {
    setCommentDialogOpen(false);
  };

  const handleAddComment = async () => {
    const newComment = new Comment(comment);
    // position of doc comment!
    // editor?.commands.setComment(newComment.position);
    const response = await addComment({
      ...newComment,
      docId: id as string,
    }).unwrap();
    // setActiveCommentId(newComment.position);
    handleClose();
  };
  return (
    <Dialog open={openCommentDialog} onClose={handleClose}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Avatar size={32} src={user?.avatar?.link} />
        <span>{user?.fullname}</span>
      </DialogTitle>
      <DialogContent sx={{ minWidth: "384px" }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Comment"
          type="text"
          fullWidth
          defaultValue={comment}
          onChange={(e) => setComment(e.target.value)}
          InputLabelProps={{ sx: { color: "InactiveCaptionText" } }}
          sx={{ color: "inherit" }}
          variant="standard"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddComment();
            if (e.key === "Esc") setCommentDialogOpen(!openCommentDialog);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: "none" }}
          color="inherit"
          onClick={handleClose}
        >
          {t("button.cancel")}
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          onClick={() => handleAddComment()}
        >
          {t("button.comment")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
