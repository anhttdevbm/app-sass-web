import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "icons/CloseIcon";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export default function NotSupportBrowser({ open, onClose }: IProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          background: "#000",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Not Support Browser
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "#fff", width: "20px", height: "20px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          background: "#000",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Oops...
          </p>
          <p
            style={{
              color: "#fff",
              fontSize: "18px",
              margin: "4px 0",
            }}
          >
            Your browser is not supported :-(
          </p>
          <p
            style={{
              color: "#fff",
              fontSize: "18px",
              margin: "4px 0",
            }}
          >
            Please use another browser to use this feature.
          </p>
          <p
            style={{
              color: "#fff",
              fontSize: "18px",
              margin: "4px 0",
            }}
          >
            Thank you!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
