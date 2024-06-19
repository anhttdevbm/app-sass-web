"use client";

import { Card, Stack } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import MeetingHeaderLayout from "./MeetingHeaderLayout";
import OptionButtonsLayout from "./footer/OptionButtonLayout";
import RightSidebar from "./right-sidebar/RightSidebar";
import VideoScreen from "../components/VideoScreen";
import useBreakpoint from "hooks/useBreakpoint";
import useWindowSize from "hooks/useWindowSize";
import useTheme from "hooks/useTheme";

export default function MeetingLayout() {
  const { isDarkMode } = useTheme();
  const breack = useBreakpoint();
  const size = useWindowSize();

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [active, setActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        // audio: window.confirm("Allow access to microphone?"),
        // video: window.confirm("Allow access to camera?"),
        audio: true,
        video: true,
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
  }, []);

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
    <Card sx={{ height: "100%", borderRadius: 0 }}>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent={"space-between"}
        pb={0}
        sx={{ height: "100%" }}
      >
        <Stack
          direction={"column"}
          gap={3.5}
          sx={{
            width: "calc(100% - 400px)",
            backgroundColor: isDarkMode
              ? "var(--mui-palette-grey-50)"
              : "white",
            justifyContent: "space-between",
          }}
        >
          <MeetingHeaderLayout sx={{ px: 3 }} />
          <VideoScreen sx={{ flexGrow: 1, px: 3 }} users={initUsers} />
          <OptionButtonsLayout
            sx={{
              width: "100%",
              boxShadow: "0 -3px 20px 1px #00000026",
            }}
          />
        </Stack>

        <RightSidebar />
      </Stack>
    </Card>
  );
}

const initUsers = [
  {
    id: "1",
    name: "John Doe",
    isMe: true,
    avatar: "https://via.placeholder.com/150",
    stream: null,
    isMicOn: true,
    isCameraOn: true,
    isSpeaker: true,
    recordStatus: "no" || "started" || "stopped",
  },
  {
    id: "2",
    name: "Mark Smith",
    avatar: "https://via.placeholder.com/150",
    stream: null,
    isMicOn: false,
    isCameraOn: false,
    isSpeaker: false,
    recordStatus: "no" || "started" || "stopped",
  },
  {
    id: "3",
    name: "Frank Doe",
    avatar: "https://via.placeholder.com/150",
    stream: null,
    isMicOn: true,
    isCameraOn: false,
    isSpeaker: true,
    recordStatus: "no" || "started" || "stopped",
  },
  {
    id: "4",
    name: "Hoang Van Doe",
    avatar: "https://via.placeholder.com/150",
    stream: null,
    isMicOn: false,
    isCameraOn: true,
    isSpeaker: false,
    recordStatus: "no" || "started" || "stopped",
  },
  {
    id: "5",
    name: "Steven Doe",
    avatar: "https://via.placeholder.com/150",
    stream: null,
    isMicOn: true,
    isCameraOn: false,
    isSpeaker: false,
    recordStatus: "no" || "started" || "stopped",
  },
  {
    id: "6",
    name: "Steven Doe",
    avatar: "https://via.placeholder.com/150",
    stream: null,
    isMicOn: true,
    isCameraOn: false,
    isSpeaker: false,
    recordStatus: "no" || "started" || "stopped",
  },
];

const initMessagesArray = [
  {
    user: {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Hello, how are you?",
  },
  {
    user: {
      id: 2,
      name: "Mark Smith",
      avatar: "https://via.placeholder.com/150",
    },
    message: "I'm doing great, thanks!",
  },
  {
    user: {
      id: 3,
      name: "Frank Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Nice to meet you!",
  },
  {
    user: {
      id: 4,
      name: "Hoang Van Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Hello everyone!",
  },
  {
    user: {
      id: 5,
      name: "Steven Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Good morning!",
  },
];
