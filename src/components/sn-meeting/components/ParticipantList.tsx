import { Box, Stack } from "@mui/material";
import { store } from "store/configureStore";
import VideoParticipant from "./VideoParticipant";

export default function ParticipantList() {
  const { remoteStreams } = store.getState().meeting;

  return (
    <Stack
      sx={{
        display: "flex",
        overflow: "auto hidden",
        flexDirection: "row",
        gap: "16px",
        height: "fit-content",
        flexShrink: 0,
      }}
    >
      {remoteStreams.map((remoteStream) => {
        return (
          <Box
            key={remoteStream.stream.id}
            sx={{
              flexShrink: 0,
              width: "245px",
            }}
          >
            <VideoParticipant streamData={remoteStream} />
          </Box>
        );
      })}
    </Stack>
  );
}
