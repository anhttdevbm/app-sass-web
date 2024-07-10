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
  togglePinScreen: () => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  isScreenPinned: boolean;
  isMicOn: boolean;
  isCameraOn: boolean;
  sx: object;
}

const ButtonOnMyScreen = (props: ButtonOnMyScreenProps) => {
  const {
    togglePinScreen,
    toggleMic,
    toggleCamera,
    isScreenPinned,
    isMicOn,
    isCameraOn,
  } = props;
  // const [isMicOn, setIsMicOn] = useState(true);
  // const [isCameraOn, setIsCameraOn] = useState(true);
  // const [isScreenPinned, setIsScreenPinned] = useState(false);

  // const toggleMic = () => {
  //   setIsMicOn(!isMicOn);
  // };

  // const toggleCamera = () => {
  //   setIsCameraOn(!isCameraOn);
  // };

  // const togglePinScreen = () => {
  //   setIsScreenPinned(!isScreenPinned);
  // };
  return (
    <Box textAlign={"center"} sx={{ ...props.sx }}>
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
        <IconButton
          onClick={toggleCamera}
          sx={isCameraOn ? sxBtnCircleActive : sxBtnCircleDanger}
        >
          {isCameraOn ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Stack>
    </Box>
  );
};

export default ButtonOnMyScreen;
