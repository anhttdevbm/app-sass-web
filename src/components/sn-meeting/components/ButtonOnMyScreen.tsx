import { Box, IconButton, Stack } from "@mui/material";
import { sxBtnCircleActive } from "components/sn-meeting/style";
import { MicrophoneIconV1 } from "icons/MicrophoneIconV1";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import { PinScreenIcon } from "icons/PinScreenIcon";
import { UnpinScreenIcon } from "icons/UnpinScreenIcon";
import { VideoIcon } from "icons/VideoIcon";
import { VideoSlashIcon } from "icons/VideoSlashIcon";
import { useState } from "react";
import { LocalStreamState } from "store/meeting/types";

interface ButtonOnMyScreenProps {
  sx: object;
  localStream: MediaStream;
  isLocalStream: boolean;
  streamState: LocalStreamState;
}

const ButtonOnMyScreen = ({
  localStream,
  sx,
  isLocalStream,
  streamState,
}: ButtonOnMyScreenProps) => {
  const { isCameraOn, isMicOn } = streamState || {
    isCameraOn: true,
    isMicOn: true,
  };
  const [isScreenPinned, setIsScreenPinned] = useState(false);

  // const toggleMic = () => {
  //   setIsMicOn(!isMicOn);
  //   localStream
  //     .getAudioTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  // };

  // const toggleCamera = () => {
  //   setIsCameraOn(!isCameraOn);
  //   localStream
  //     .getVideoTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  // };

  const togglePinScreen = () => {
    setIsScreenPinned(!isScreenPinned);
  };
  return (
    <Box textAlign={"center"} sx={{ ...sx }} id="btn_screen">
      <Stack direction={"row"} gap={1}>
        <IconButton onClick={togglePinScreen} sx={sxBtnCircleActive}>
          {isScreenPinned ? <UnpinScreenIcon /> : <PinScreenIcon />}
        </IconButton>
        <IconButton sx={sxBtnCircleActive}>
          {isMicOn ? (
            <MicrophoneIconV1
              sx={{
                "& path": {
                  fill: "#FFF",
                },
                "& path:last-of-type": {
                  stroke: "#FFF",
                },
              }}
            />
          ) : (
            <MicrophoneSlashIcon />
          )}
        </IconButton>
        {isLocalStream && (
          <IconButton sx={sxBtnCircleActive}>
            {isCameraOn ? (
              <VideoIcon
                sx={{
                  fill: "#FFF",
                  "& path:not(:last-of-type)": {
                    stroke: "#FFF",
                  },
                }}
              />
            ) : (
              <VideoSlashIcon
                sx={{
                  "& path": {
                    fill: "#fff",
                    stroke: "#fff",
                  },
                }}
              />
            )}
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default ButtonOnMyScreen;
