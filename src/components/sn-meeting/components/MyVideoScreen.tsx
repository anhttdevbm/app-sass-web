import { Avatar, Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";

interface MyVideoScreenProps {
  sx: object | null;
}

const MyVideoScreen: React.FC<MyVideoScreenProps> = (
  props: MyVideoScreenProps,
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { localStream } = store.getState().meeting;
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenPinned, setIsScreenPinned] = useState(false);
  const { localStreamState } = store.getState().meeting;
  const { user } = useAuth();

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

      // Do something with the video URL, e.g., download or display it
      // For example, you can create a download link:
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
        ...props.sx,
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
        }}
      />
      {!localStreamState.isCameraOn && <Avatar src={user?.avatar?.link} />}
      {/* <ButtonOnMyScreen
        sx={{
          position: "absolute",
          bottom: "50%",
          right: "50%",
          transform: "translateX(50%) translateY(50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          borderRadius: "90px",
          padding: "8px 16px",
          backdropFilter: "blur(20px)",
        }}
        togglePinScreen={togglePinScreen}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        isScreenPinned={isScreenPinned}
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
      /> */}
      {/* <Box>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </Box> */}
    </Box>
  );
};

export default MyVideoScreen;
