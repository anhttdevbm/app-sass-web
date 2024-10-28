import { Box } from "@mui/material";
import Avatar from "components/Avatar";
import { Emoji } from "emoji-picker-react";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";
import { useAppSelector } from "store/hooks";
import {
  setLocalStreamState,
  updateRemoteStreamState,
} from "store/meeting/reducer";
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
    if (
      remoteVideoRef.current &&
      remoteStream.stream &&
      (remoteVideoRef.current?.srcObject as MediaStream)?.id !==
        remoteStream?.stream.id
    ) {
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

  useEffect(() => {
    if (localStreamState && localStreamState.reactionUnified) {
      const timer = setTimeout(() => {
        store.dispatch(
          setLocalStreamState({
            ...localStreamState,
            reactionUnified: "",
          }),
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [localStreamState]);

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
          backgroundColor: "#000",
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
        {localStreamState.isRaiseHand && (
          <Box
            sx={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              zIndex: 10,
              fontSize: "24px",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "4px",
              borderRadius: "8px",
              userSelect: "none",
              cursor: "default",
            }}
          >
            🖐️
          </Box>
        )}
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Emoji unified={localStreamState.reactionUnified} size={30} />
        </Box>
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

            backgroundColor: "#000",
          }}
        >
          {remoteStream.streamState.isRaiseHand && (
            <Box
              sx={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                zIndex: 10,
                fontSize: "24px",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "4px",
                borderRadius: "8px",
                userSelect: "none",
                cursor: "default",
              }}
            >
              🖐️
            </Box>
          )}
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
              src={remoteStream.participant.avatar}
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
