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

export default function MeetingLayout() {
  const { isDarkMode } = useTheme();
  const breack = useBreakpoint();
  const size = useWindowSize();

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket>(null);
  const peerRef = useRef<unknown[]>([]);

  const [peers, setPeers] = useState<any>([]);
  const [active, setActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [toggleMinimize, setToggleMinimize] = useState(false);
  const meetingRoomState = useAppSelector((state) => state.meetingRoom);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) =>
      socketRef.current?.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      }),
    );

    return peer;
  };

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
    try {
      navigator.mediaDevices
        .getUserMedia({
          // audio: window.confirm("Allow access to microphone?"),
          // video: window.confirm("Allow access to camera?"),
          audio: true,
          video: true,
        })
        .then((stream) => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          socketRef.current?.emit("join room");
          socketRef.current?.on("all user", (users) => {
            const peers: any[] = [];
            users.forEach((userID) => {
              const peer = createPeer(userID, socketRef.current?.id, stream);
              peerRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push(peer);
            });
            setPeers(peers);
          });

          socketRef.current?.on("user joined", (payload) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peerRef.current.push({
              peerID: payload.callerID,
              peer,
            });

            setPeers((users) => [...users, peer]);
          });

          socketRef.current?.on("receiving returned signal", (payload) => {
            const item: any = peerRef.current?.find(
              (p: any) => p.peerID === payload.id,
            );
            item.peer.signal(payload.signal);
          });
        });
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

  const toggleMinimizeMeeting = () => {
    setToggleMinimize(!toggleMinimize);
  };

  return (
    <div>
      meeting room
      <video muted ref={videoRef} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
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

const Video = (props) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current!.srcObject = stream;
    });
  }, []);

  return <video playsInline autoPlay ref={ref} />;
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
