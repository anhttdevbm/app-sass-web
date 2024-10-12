"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
} from "@mui/material";
import { RecordCircleIcon } from "icons/RecordCircleIcon";
import { useReactMediaRecorder } from "react-media-recorder";
import { sxBtnCircleActiveLight } from "../style";
import { store } from "store/configureStore";
import { setIsRecording } from "store/meeting/reducer";
import { Circle } from "@mui/icons-material";
import { useState } from "react";
export default function RecordButton() {
  const [open, setOpen] = useState(false);

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      screen: true,
      selfBrowserSurface: "include",
      onStop: (blobUrl) => {
        store.dispatch(setIsRecording(false));
        window.open(blobUrl, "_blank");
        clearBlobUrl();
      },
      onStart: () => {
        store.dispatch(setIsRecording(true));
      },
    });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onStopRecording = () => {
    stopRecording();
    setOpen(false);
  };
  return (
    <>
      <IconButton
        sx={
          status === "recording"
            ? {
                ...sxBtnCircleActiveLight,
                border: "1px solid #FECDD0",
                background: "#FECDD0",
              }
            : sxBtnCircleActiveLight
        }
        style={{
          width: "40px",
          height: "40px",
          padding: "0",
        }}
        onClick={status === "recording" ? handleClickOpen : startRecording}
      >
        {status === "recording" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #FEA3AA",
              borderRadius: "100%",
              width: "28px",
              height: "28px",
            }}
          >
            <Circle color="error" />
          </Box>
        ) : (
          <RecordCircleIcon
            sx={{
              "& path": {
                fill: "currentcolor",
                stroke: "currentcolor",
              },
            }}
          />
        )}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: "16px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          Stop Recording
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            padding: "24px",
            maxWidth: "100%",
            width: "452px",
          }}
        >
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: "#000",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Are you sure to stop recording?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            pb: "24px",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              fontSize: "14px",
              minWidth: "150px",
              textTransform: "capitalize",
              fontWeight: "600",
            }}
          >
            Cancle
          </Button>
          <Button
            onClick={onStopRecording}
            autoFocus
            sx={{
              fontSize: "14px",
              minWidth: "150px",
              textTransform: "capitalize",
              fontWeight: "600",
              color: "#FFF",
              backgroundColor: "#3699FF",
              "&:hover": {
                backgroundColor: "#3699FF",
                opacity: 0.9,
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
