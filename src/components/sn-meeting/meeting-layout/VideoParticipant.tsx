import {
  Mic,
  MicNone,
  MicOff,
  PushPin,
  RecordVoiceOverSharp,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { sxBtnCircleActive, sxBtn } from "../style";

interface VideoParticipantProps {
  sx: object;
}

const VideoParticipant: React.FC<VideoParticipantProps> = (
  props: VideoParticipantProps,
) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const [isScreenPinned, setIsScreenPinned] = useState(false);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const togglePinScreen = () => {
    setIsScreenPinned(!isScreenPinned);
  };

  return (
    <Box
      sx={{
        width: "200px",
        height: "200px",
        bgcolor: "red",
        ...props.sx,
      }}
    >
      <video src="user_video_url" autoPlay muted={!isMicOn} />
      <Box textAlign={'center'}>
        <Box>
          <IconButton onClick={togglePinScreen} sx={sxBtnCircleActive}>
            {isScreenPinned ? <PushPin /> : <PushPin />}
          </IconButton>
          <IconButton onClick={toggleMic} sx={sxBtnCircleActive}>
            {isMicOn ? <Mic /> : <MicOff />}
          </IconButton>
          <IconButton onClick={toggleCamera} sx={sxBtnCircleActive}>
            {isCameraOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoParticipant;
