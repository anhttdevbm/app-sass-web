"use client";

import { Card, Stack } from "@mui/material";

import useTheme from "hooks/useTheme";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { store } from "store/configureStore";
import { useAppSelector } from "store/hooks";
import {
  endMeet,
  resetMeet,
  setLocalStream,
  setLocalStreamState,
} from "store/meeting/reducer";
import { useMeeting } from "store/meeting/selectors";
import VideoScreen from "../components/VideoScreen";
import MeetingHeaderLayout from "./MeetingHeaderLayout";
import OptionButtonsLayout from "./footer/OptionButtonLayout";
import RightSidebar from "./right-sidebar/RightSidebar";

export default function MeetingLayout() {
  // useWSMeeting();
  const { isDarkMode } = useTheme();
  const { isEndMeeting, localStream } = useAppSelector(
    (state) => state.meeting,
  );
  const { onLeaveMeeting } = useMeeting();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const router = useRouter();
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

  // useEffect(() => {
  //   const handleEndMeeting = async () => {
  //     localStream?.getTracks().forEach((track) => track.stop());
  //     store.dispatch(endMeet());
  //   };
  //   isEndMeeting && handleEndMeeting();
  // }, [isEndMeeting]);

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        borderRadius: 0,
        padding: "24px",
        background: "#F5F5FD",
      }}
    >
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
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
            flex: 1,
          }}
        >
          <MeetingHeaderLayout
            isRecording={false}
            sx={{ px: 3 }}
            toggleMinimizeMeeting={toggleMinimizeMeeting}
          />
          <VideoScreen sx={{ flex: 1, px: 3 }} />

          <OptionButtonsLayout
            sx={{
              width: "100%",
              boxShadow: "0 -3px 20px 1px #00000026",
              flexShrink: 0,
            }}
          />
        </Stack>
        <RightSidebar />
      </Stack>
    </Card>
  );
}
