import { Box } from "@mui/material";
import Avatar from "components/Avatar";
import { Emoji } from "emoji-picker-react";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";
import { useAppSelector } from "store/hooks";
import { updateRemoteStreamState } from "store/meeting/reducer";
import { ParticipantStreamEvent } from "store/meeting/types";

export default function OneToOneCallLayout() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStreams, localStreamState } = useAppSelector(
    (state) => state.meeting,
  );
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

  useEffect(() => {
    if (remoteStream && remoteStream.streamState.reactionUnified) {
      const timer = setTimeout(() => {
        store.dispatch(
          updateRemoteStreamState({
            event: ParticipantStreamEvent.REACTION,
            participantId: remoteStream.participant.id,
            value: "",
          }),
        );
      }, 5000);

      return () => clearTimeout(timer);
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
        "&:hover #btn_screen": {
          display: "block",
        },
        paddingX: "24px",
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
                user?.avatar
                  ? user?.avatar
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
            borderRadius: "12px",
          }}
        />

        {!localStreamState.isCameraOn && (
          <Avatar
            src={user?.avatar}
            size={64}
            alt={user?.fullname}
            style={{
              borderRadius: "12px",
              zIndex: 9,
            }}
          />
        )}
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
                    ? remoteStream.participant.avatar[0]
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
            playsInline
            sx={{
              width: remoteStream.streamState.isCameraOn ? "unset" : "0%",
              height: "100%",
              borderRadius: "12px",
              backgroundColor: "#000",
            }}
          />

          {!remoteStream.streamState.isCameraOn && (
            <Avatar
              src={remoteStream.participant.avatar[0]}
              size={64}
              alt={remoteStream.participant.fullname}
              style={{
                borderRadius: "12px",
                zIndex: 9,
              }}
            />
          )}
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              left: "8px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Emoji
              unified={remoteStream.streamState.reactionUnified}
              size={30}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
