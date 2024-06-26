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
import { Socket } from "socket.io-client";
import Peer from "simple-peer";
import { useAppSelector } from "store/hooks";
import { useMeeting } from "store/meeting/selectors";
import { useChat } from "store/chat/selectors";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "store/app/selectors";
import { useWSMeetingConnect } from "store/meeting/meetingWs";
import { useWSMeeting } from "store/meeting/helper";
import { clientStorage } from "utils/storage";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";

export default function MeetingLayout() {
  const { isDarkMode } = useTheme();
  const breack = useBreakpoint();
  const size = useWindowSize();
  const { user } = useAuth();
  const pathname = usePathname();
  const roomId = pathname.split("/")[2];

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket>(null);
  const peerRef = useRef<unknown[]>([]);
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

  const { isEndMeeting, onEndMeeting } = useMeeting();
  const { dataTransfer } = useChat();
  const router = useRouter();
  const [toggleMinimize, setToggleMinimize] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteSrteam, setRemoteStream] = useState<MediaStream | null>(null);
  const [err, setErr] = useState("");
  const WebSocketRef = useRef<WebSocket>(null);

  console.log(dataTransfer);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {});

    return peer;
  }

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current?.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const startMedia = async () => {
    const meetingWs = new WebSocket(
      `${process.env.NEXT_APP_MEETING_WS_URL}/${dataTransfer.id}?token=${aT}` ||
        "",
    );
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (userVideoRef.current && stream) {
        setLocalStream(stream);
        userVideoRef.current.srcObject = stream;
      }
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        meetingWs.send(
          JSON.stringify({
            peer_id: user?.id,
            sdp: signal,
          }),
        );
      });
    } catch (error: any) {
      setErr(error.message.toString());
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    startMedia();
  }, []);

  const startRecording = () => {
    const stream = userVideoRef.current?.srcObject as MediaStream;
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

  const toggleMinimizeMeeting = () => {
    setToggleMinimize(!toggleMinimize);
  };

  const endMeeting = () => {
    onEndMeeting(roomId);
  };

  // if (isEndMeeting) {
  //   return <p>Meeting has ended</p>;
  // }

  return (
    <div>
      <h2>meeting room</h2>
      <button onClick={endMeeting}>end meet</button>
      <p>
        localStream: {localStream ? "yes" : "no"} <span>{err && err}</span>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        <video
          playsInline
          muted
          autoPlay
          ref={userVideoRef}
          style={{
            background: "gray",
            marginRight: "1em",
            width: "100%",
            height: "300px",
          }}
        />
        <video
          playsInline
          muted
          autoPlay
          ref={partnerVideoRef}
          style={{ background: "gray", width: "100%", height: "300px" }}
        />
      </div>
    </div>

    // <Card sx={{ height: "100%", borderRadius: 0, bgcolor: "black" }}>
    //   <Stack
    //     direction="row"
    //     alignItems="stretch"
    //     justifyContent={"space-between"}
    //     pb={0}
    //     sx={{ height: "100%" }}
    //   >
    //     <Stack
    //       direction={"column"}
    //       gap={3.5}
    //       sx={{
    //         width: "calc(100% - 400px)",
    //         backgroundColor: isDarkMode
    //           ? "var(--mui-palette-grey-50)"
    //           : "white",
    //         justifyContent: "space-between",
    //       }}
    //     >
    //       <MeetingHeaderLayout
    //         sx={{ px: 3 }}
    //         toggleMinimizeMeeting={toggleMinimizeMeeting}
    //       />
    //       <video
    //         muted
    //         ref={videoRef}
    //         autoPlay
    //         playsInline
    //         style={{ background: "gray" }}
    //       />
    //       <VideoScreen sx={{ flexGrow: 1, px: 3 }} users={initUsers} />
    //       <OptionButtonsLayout
    //         sx={{
    //           width: "100%",
    //           boxShadow: "0 -3px 20px 1px #00000026",
    //         }}
    //       />
    //     </Stack>

    //     <RightSidebar />
    //   </Stack>
    // </Card>
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
