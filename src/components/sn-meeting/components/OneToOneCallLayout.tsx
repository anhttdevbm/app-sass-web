import { Avatar, Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";

export default function OneToOneCallLayout() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStreams } = store.getState().meeting;
  const { localStreamState } = store.getState().meeting;
  const { user } = useAuth();
  const remoteStream = useMemo(() => remoteStreams[0], [remoteStreams]);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream.stream;
    }
  }, [remoteStream]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        gap: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          aspectRatio: "16/9",
          flex: 1,
        }}
      >
        {!localStreamState.isCameraOn && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${
                user?.avatar?.link
                  ? user?.avatar?.link
                  : "/images/img-user-placeholder.webp"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(8px)",
              zIndex: 0,
            }}
          />
        )}
        <Box
          component={"video"}
          ref={videoRef}
          autoPlay
          muted
          playsInline
          sx={{
            width: localStreamState.isCameraOn ? "unset" : "0%",
            height: "100%",
          }}
        />

        {!localStreamState.isCameraOn && <Avatar src={user?.avatar?.link} />}
      </Box>
      {remoteStream && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            width: "100%",
            aspectRatio: "16/9",
            flex: 1,
          }}
        >
          {!remoteStream.streamState.isCameraOn && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${
                  remoteStream.participant.avatar
                    ? remoteStream.participant.avatar
                    : "/images/img-user-placeholder.webp"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px)",
                zIndex: 0,
              }}
            />
          )}
          <Box
            component={"video"}
            ref={remoteVideoRef}
            autoPlay
            muted
            playsInline
            sx={{
              width: remoteStream.streamState.isCameraOn ? "unset" : "0%",
              height: "100%",
            }}
          />

          {!remoteStream.streamState.isCameraOn && (
            <Avatar src={remoteStream.participant.avatar} />
          )}
        </Box>
      )}
    </Box>
  );
}
