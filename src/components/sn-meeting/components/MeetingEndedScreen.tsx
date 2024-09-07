import { Box, Button, Fab, Typography } from "@mui/material";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import CallIcon from "icons/CallIcon";
import CloseIcon from "icons/CloseIcon";

export default function MeetingEndedScreen() {
  const onClose = () => {
    window.close();
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        gap: "20px",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          color: "#E4E6EB",
          fontSize: "24px",
          fontWeight: "700",
          fontFamily: inter.style.fontFamily,
        }}
      >
        Your meeting has ended. Thank you.
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Button
          sx={{
            backgroundColor: "#6CD64F",
            minWidth: "unset",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#6CD64F",
              opacity: 0.8,
            },
          }}
        >
          <CallIcon />
        </Button>
        <Button
          sx={{
            backgroundColor: "#FFFFFF33",
            color: "#FFF",
            minWidth: "unset",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#FFFFFF33",
              opacity: 0.8,
            },
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </Button>
      </Box>
    </Box>
  );
}
