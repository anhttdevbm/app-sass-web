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
import React, { useEffect, useRef, useState } from "react";
import { sxBtnCircleActive, sxBtn } from "../style";
import ButtonOnMyScreen from "./ButtonOnMyScreen";

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
        width: "100%",
        height: "100%",
        // bgcolor: "red",
        position: "relative",
        ...props.sx,
      }}
    >
      <Box textAlign={"center"}>
        <video
          src="user_video_url"
          width={"100%"}
          style={{ backgroundColor: "red" }}
          autoPlay
          muted={!isMicOn}
        />
      </Box>
      <ButtonOnMyScreen
        sx={{
          position: "absolute",
          bottom: "10px",
          right: "50%",
          transform: "translateX(50%)",
        }}
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        isScreenPinned={isScreenPinned}
        toggleCamera={toggleCamera}
        toggleMic={toggleMic}
        togglePinScreen={togglePinScreen}
      />
    </Box>
  );
};

export default VideoParticipant;
