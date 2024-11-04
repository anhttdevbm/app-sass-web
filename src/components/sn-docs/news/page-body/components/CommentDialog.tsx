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
import { useParams } from "next/navigation";
import * as React from "react";
import { useAuth } from "store/app/selectors";
import { usePostCommentMutation } from "store/docs/api";
import { NewPageContext } from "../../context/NewPageContext";

export default function CommentDialog() {
  const {
    openCommentDialog,
    commentPosition,
    showExistComment,
    handleCloseCommentDialog,
  } = React.useContext(NewPageContext);
  const { user } = useAuth();
  const t = useTranslations(NS_DOCS);
  const [addComment] = usePostCommentMutation();
  const [comment, setComment] = React.useState<string>(
    showExistComment ? showExistComment.comment[0].content : "",
  );
  const { id } = useParams();

  const handleAddComment = async () => {
    const response = await addComment({
      docId: id as string,
      content: comment,
      position: commentPosition,
    }).unwrap();

    handleCloseCommentDialog();
  };
  React.useEffect(() => {
    if (showExistComment) {
      setComment(showExistComment.comment[0].content);
    } else setComment("");
  }, [showExistComment]);
  return (
    <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Avatar size={32} src={user?.avatar} />
        <span>{user?.fullname}</span>
      </DialogTitle>
      <DialogContent sx={{ minWidth: "384px" }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Comment"
          spellCheck={false}
          type="text"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputLabelProps={{ sx: { color: "InactiveCaptionText" } }}
          sx={{ color: "inherit" }}
          variant="standard"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddComment();
            if (e.key === "Esc") handleCloseCommentDialog();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: "none" }}
          color="inherit"
          onClick={handleCloseCommentDialog}
        >
          {t("button.cancel")}
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          onClick={() => handleAddComment()}
          disabled={showExistComment ? true : false}
        >
          {t("button.comment")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
