import { Box, Typography } from "@mui/material";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import { VideoSlashIcon } from "icons/VideoSlashIcon";

export default function MediaPermission() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background: "#000",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <MicrophoneSlashIcon
          sx={{
            "& path": {
              stroke: "#F64E60",
              fill: "#F64E60",
            },
            width: "40px",
            height: "40px",
          }}
        />
        <VideoSlashIcon
          sx={{
            width: "40px",
            height: "40px",
          }}
        />
      </Box>
      <Box>
        <Typography
          sx={{
            textAlign: "center",
            color: "#E4E6EB",
            fontSize: "24px",
            fontWeight: "700",
            fontFamily: inter.style.fontFamily,
            marginBottom: "8px",
          }}
        >
          You have not allowed Taskcover to access your microphone.
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#E4E6EB",
            fontSize: "15px",
            fontFamily: inter.style.fontFamily,
          }}
        >
          Allow Taskcover to use your microphone so call participants can hear
          you. You can turn this permission off later.
        </Typography>
      </Box>
    </Box>
  );
}
