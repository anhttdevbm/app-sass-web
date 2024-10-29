import { Avatar, Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";
import ButtonOnMyScreen from "./ButtonOnMyScreen";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import { MicrophoneIconV1 } from "icons/MicrophoneIconV1";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import { sxBtnCircleActiveDark } from "../style";
import useTheme from "hooks/useTheme";

interface MyVideoScreenProps {
  sx: object | null;
}

const MyVideoScreen: React.FC<MyVideoScreenProps> = (
  props: MyVideoScreenProps,
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { localStream, meetInfo } = store.getState().meeting;
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenPinned, setIsScreenPinned] = useState(false);
  const { localStreamState } = store.getState().meeting;
  const { user } = useAuth();

  const { isDarkMode } = useTheme();

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const togglePinScreen = () => {
    setIsScreenPinned(!isScreenPinned);
  };

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const startRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    const chunks: Blob[] = [];

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorderRef.current.addEventListener("stop", () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = videoUrl;
      downloadLink.download = "my_video.webm";
      downloadLink.click();

      // Clean up
      URL.revokeObjectURL(videoUrl);
      chunks.length = 0;
    });

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        aspectRatio: "16/9",
        backgroundColor: "#000",
        ...props.sx,
        "&:hover #btn_screen": {
          display: "block",
        },
      }}
    >
      <Box
        component={"video"}
        ref={videoRef}
        autoPlay
        muted
        playsInline
        sx={{
          width: localStreamState.isCameraOn ? "100%" : "0%",
          height: "100%",

          backgroundColor: "#000",
          borderRadius: "12px",
        }}
      />

      {!localStreamState.isCameraOn && <Avatar src={user?.avatar} />}

      <Box
        id="mic-ui"
        sx={[
          localStreamState.isMicOn
            ? isDarkMode
              ? sxBtnCircleActiveDark
              : {
                  borderRadius: "50%",
                  background: "#3699FF",
                  "&:hover": {
                    bgcolor: "#3699FF",
                  },
                }
            : {
                borderRadius: "50%",
                backgroundColor: "#F64E60",
                color: "#F64E60",
                "&:hover": {
                  bgcolor: "#F64E60",
                  color: "#F64E60",
                },
              },
          {
            position: "absolute",
            right: 16,
            bottom: 16,
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          },
        ]}
      >
        {localStreamState.isMicOn ? (
          <MicrophoneIconV1
            sx={{
              position: "relative",
              left: "1px",
            }}
          />
        ) : (
          <MicrophoneSlashIcon />
        )}
      </Box>

      {localStream && !localStreamState.isCameraOn && (
        <ButtonOnMyScreen
          sx={{
            position: "absolute",
            bottom: "50%",
            right: "50%",
            transform: "translateX(50%) translateY(50%)",
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: "90px",
            padding: "8px 16px",
            backdropFilter: "blur(20px)",
            display: "none",
          }}
          isLocalStream={true}
          localStream={localStream}
          streamState={localStreamState}
        />
      )}
    </Box>
  );
};

export default MyVideoScreen;
