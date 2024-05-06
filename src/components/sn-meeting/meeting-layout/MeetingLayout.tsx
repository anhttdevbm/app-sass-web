"use client";

import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import AddCircleIcon from "icons/AddCircleIcon";
import React, { useEffect, useRef, useState } from "react";
import MeetingHeaderLayout from "./MeetingHeaderLayout";
import OptionButtonsLayout from "./footer/OptionButtonLayout";
import RightSidebar from "./right-sidebar/RightSidebar";
import VideoScreen from "../components/VideoScreen";
import useBreakpoint from "hooks/useBreakpoint";
import useWindowSize from "hooks/useWindowSize";

export default function MeetingLayout() {
  const [active, setActive] = useState(false);

  const breack = useBreakpoint();
  const size = useWindowSize();

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
    <Card>
      <Stack
        direction="row"
        alignItems="stretch"
        spacing={3}
        justifyContent={"space-between"}
        p={2}
      >
        <Stack
          direction={"column"}
          sx={{ width: "calc(100% - 400px)", backgroundColor: "white" }}
        >
          <MeetingHeaderLayout sx={{}} />
          <VideoScreen sx={{}} users={initUsers} />
          <OptionButtonsLayout sx={{}} />
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
