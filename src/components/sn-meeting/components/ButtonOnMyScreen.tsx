import React, { useState } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import {
  PushPin,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import {
  sxBtnCircleActive,
  sxBtnCircleDanger,
} from "components/sn-meeting/style";

interface ButtonOnMyScreenProps {
  sx: object;
  localStream: MediaStream;
  isLocalStream: boolean;
}

const ButtonOnMyScreen = ({
  localStream,
  sx,
  isLocalStream,
}: ButtonOnMyScreenProps) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenPinned, setIsScreenPinned] = useState(false);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    localStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    localStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  };

  const togglePinScreen = () => {
    setIsScreenPinned(!isScreenPinned);
  };
  return (
    <Box textAlign={"center"} sx={{ ...sx }}>
      <Stack direction={"row"} gap={1}>
        <IconButton onClick={togglePinScreen} sx={sxBtnCircleActive}>
          {isScreenPinned ? <PushPin /> : <PushPin />}
        </IconButton>
        <IconButton
          onClick={toggleMic}
          sx={isMicOn ? sxBtnCircleActive : sxBtnCircleDanger}
        >
          {isMicOn ? <Mic /> : <MicOff />}
        </IconButton>
        {isLocalStream && (
          <IconButton
            onClick={toggleCamera}
            sx={isCameraOn ? sxBtnCircleActive : sxBtnCircleDanger}
          >
            {isCameraOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default ButtonOnMyScreen;
