"use client";

import { Box, Card, Stack, Avatar as MuiAvatar } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import MeetingHeaderLayout from "./MeetingHeaderLayout";
import OptionButtonsLayout from "./footer/OptionButtonLayout";
import RightSidebar from "./right-sidebar/RightSidebar";
import VideoScreen from "../components/VideoScreen";
import useBreakpoint from "hooks/useBreakpoint";
import useWindowSize from "hooks/useWindowSize";
import useTheme from "hooks/useTheme";
import { useAuth } from "store/app/selectors";
import { useAppSelector } from "store/hooks";
import { useWSMeeting } from "webSocket/wsConnection";
import Avatar from "components/Avatar";
import ButtonOnMyScreen from "../components/ButtonOnMyScreen";

export default function MeetingLayout() {
  useWSMeeting();
  const { isDarkMode } = useTheme();
  const breack = useBreakpoint();
  const size = useWindowSize();
  const { user } = useAuth();
  const { localStream, remoteStream } = useAppSelector(
    (state) => state.meeting,
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [toggleMinimize, setToggleMinimize] = useState(false);

  // const startRecording = () => {
  //   const stream = userVideoRef.current?.srcObject as MediaStream;
  //   const chunks: Blob[] = [];

  //   mediaRecorderRef.current = new MediaRecorder(stream);

  //   mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
  //     if (event.data.size > 0) {
  //       chunks.push(event.data);
  //     }
  //   });

  //   mediaRecorderRef.current.addEventListener("stop", () => {
  //     const videoBlob = new Blob(chunks, { type: "video/webm" });
  //     const videoUrl = URL.createObjectURL(videoBlob);

  //     // Do something with the video URL, e.g., download or display it
  //     // For example, you can create a download link:
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = videoUrl;
  //     downloadLink.download = "my_video.webm";
  //     downloadLink.click();

  //     // Clean up
  //     URL.revokeObjectURL(videoUrl);
  //     chunks.length = 0;
  //   });

  //   mediaRecorderRef.current.start();
  // };

  // const stopRecording = () => {
  //   if (mediaRecorderRef.current) {
  //     mediaRecorderRef.current.stop();
  //   }
  // };

  const toggleMinimizeMeeting = () => {
    setToggleMinimize(!toggleMinimize);
  };

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        minWidth: "1440px",
        overflow: "auto",
        borderRadius: 0,
        bgcolor: "black",
      }}
    >
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
          <MeetingHeaderLayout
            sx={{ px: 3 }}
            toggleMinimizeMeeting={toggleMinimizeMeeting}
          />
          {/* <VideoScreen sx={{ flexGrow: 1, px: 3 }} users={initUsers} /> */}
          <Stack
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              placeItems: "center",
              height: "100%",
              padding: 2,
            }}
          >
            {localStream ? (
              <VideoStreaming localStream={localStream} isLocalStream={true} />
            ) : (
              <Avatar size={100} src={user?.avatar?.link} />
            )}
            {remoteStream ? (
              <VideoStreaming
                localStream={remoteStream}
                isLocalStream={false}
              />
            ) : (
              <MuiAvatar
                sx={{ width: 100, height: 100 }}
                src="/static/images/avatar/1.jpg"
              />
            )}
          </Stack>
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

const VideoStreaming = ({
  localStream,
  isLocalStream,
}: {
  localStream: MediaStream;
  isLocalStream: boolean;
}) => {
  const [isShow, setShow] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    video!.srcObject = localStream;

    video!.onloadedmetadata = () => {
      video!.play();

      if (isLocalStream) {
        video!.muted = true;
        video!.volume = 0;
      }
    };
  }, [localStream, isLocalStream]);

  return (
    <Box
      sx={{
        bgcolor: "gray",
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        position: "relative",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <video
        ref={videoRef}
        autoPlay
        style={{ background: "gray", width: "100%", height: "100%" }}
      />
      {isShow && (
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
          localStream={localStream}
          isLocalStream={isLocalStream}
        />
      )}
    </Box>
  );
};

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
