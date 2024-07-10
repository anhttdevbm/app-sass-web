import { Box, Card, CardMedia } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ButtonOnMyScreen from "./ButtonOnMyScreen";

interface MyVideoScreenProps {
  sx: object | null;
}

const MyVideoScreen: React.FC<MyVideoScreenProps> = (
  props: MyVideoScreenProps,
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenPinned, setIsScreenPinned] = useState(false);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const togglePinScreen = () => {
    setIsScreenPinned(!isScreenPinned);
  };

  const startMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        // audio: window.confirm("Allow access to microphone?"),
        // video: window.confirm("Allow access to camera?"),
        audio: isMicOn,
        video: isCameraOn,
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    startMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [isMicOn, isCameraOn]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        ...props.sx,
      }}
    >
      <Box
        component={"video"}
        ref={videoRef}
        autoPlay
        playsInline
        sx={{ width: "calc(100% - 400px)", height: "100%" }}
      />
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
        }}
        togglePinScreen={togglePinScreen}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        isScreenPinned={isScreenPinned}
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
      />
      {/* <Box>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </Box> */}
    </Box>
  );
};

export default MyVideoScreen;
