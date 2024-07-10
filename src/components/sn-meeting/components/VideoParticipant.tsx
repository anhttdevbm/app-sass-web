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
import {
  sxBtnCircleActive,
  sxBtn,
  sxBtnCircleDanger,
  sxBtnCircleActiveDark,
  sxBtnCircleActiveLight,
} from "../style";
import ButtonOnMyScreen from "./ButtonOnMyScreen";
import { Text } from "components/shared";
import useTheme from "hooks/useTheme";

interface VideoParticipantProps {
  user?: UserI;
}

const VideoParticipant: React.FC<VideoParticipantProps> = (
  props: VideoParticipantProps,
) => {
  const { user } = props;
  const { isDarkMode } = useTheme();
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
        borderRadius: 2,
        flex: 1,
        bgcolor: "gray",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {user?.isCameraOn ? (
        <ShowCamera
          isMicOn={isMicOn}
          toggleMic={toggleMic}
          isDarkMode={isDarkMode}
        />
      ) : (
        <ShowAvatar
          isMicOn={isMicOn}
          toggleMic={toggleMic}
          isDarkMode={isDarkMode}
        />
      )}
    </Box>
  );
};

export default VideoParticipant;

const ShowCamera = ({
  isMicOn,
  toggleMic,
  isDarkMode,
}: {
  isMicOn: boolean;
  toggleMic: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <Box
      sx={{
        backgroundImage: "url(/images/meeting/participant.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
      }}
    >
      <video src="user_video_url" width={"100%"} autoPlay muted={!isMicOn} />

      {/* <ButtonOnMyScreen
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
      /> */}
      <IconButton
        onClick={toggleMic}
        sx={[
          isMicOn
            ? isDarkMode
              ? sxBtnCircleActiveDark
              : sxBtnCircleActiveLight
            : sxBtnCircleDanger,
          { position: "absolute", right: 16, top: 16 },
        ]}
      >
        {isMicOn ? <Mic /> : <MicOff />}
      </IconButton>
      <Text
        sx={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "#000",
          color: "#fff",
          borderRadius: "90px",
          padding: "4px 12px",
          width: "max-content",
          textAlign: "center",
        }}
      >
        Alice Wong
      </Text>
    </Box>
  );
};

const ShowAvatar = ({
  isMicOn,
  toggleMic,
  isDarkMode,
}: {
  isMicOn: boolean;
  toggleMic: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        placeItems: "center",
        display: "grid",
      }}
    >
      <img
        src="/images/meeting/participant.png"
        alt="avatar"
        style={{ position: "absolute", top: 16 }}
      />
      <IconButton
        onClick={toggleMic}
        sx={[
          isMicOn
            ? isDarkMode
              ? sxBtnCircleActiveDark
              : sxBtnCircleActiveLight
            : sxBtnCircleDanger,
          { position: "absolute", right: 16, top: 16 },
        ]}
      >
        {isMicOn ? <Mic /> : <MicOff />}
      </IconButton>
      <Text
        sx={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "#000",
          color: "#fff",
          borderRadius: "90px",
          padding: "4px 12px",
          width: "max-content",
          textAlign: "center",
        }}
      >
        Alice Wong
      </Text>
    </Box>
  );
};
