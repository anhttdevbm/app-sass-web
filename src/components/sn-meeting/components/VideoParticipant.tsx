/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import useTheme from "hooks/useTheme";
import { MicrophoneIconV1 } from "icons/MicrophoneIconV1";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import { useEffect, useRef } from "react";
import { ParticipantStreamEvent, RemoteStream } from "store/meeting/types";
import { sxBtnCircleActiveDark } from "../style";
import { Emoji } from "emoji-picker-react";
import { store } from "store/configureStore";
import { updateRemoteStreamState } from "store/meeting/reducer";

interface VideoParticipantProps {
  streamData: RemoteStream;
}

const VideoParticipant = ({ streamData }: VideoParticipantProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDarkMode } = useTheme();

  const { isCameraOn, isMicOn, isRaiseHand, reactionUnified } =
    streamData.streamState;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = streamData.stream || null;
    }
  }, []);

  useEffect(() => {
    if (reactionUnified) {
      const timer = setTimeout(() => {
        store.dispatch(
          updateRemoteStreamState({
            event: ParticipantStreamEvent.REACTION,
            participantId: streamData.participant.id,
            value: "",
          }),
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reactionUnified]);

  return (
    <Box
      sx={{
        borderRadius: 2,
        flex: 1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "137px",
      }}
    >
      {/* Background Image */}
      {!isCameraOn && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${
              streamData.participant.avatar
                ? streamData.participant.avatar
                : "/images/img-user-placeholder.webp"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            zIndex: 0,
          }}
        />
      )}
      {/* Video and Avatar */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          pb: "8px",
        }}
      >
        <video
          ref={videoRef}
          width={isCameraOn ? "100%" : "0%"}
          autoPlay
          style={{
            objectFit: "cover",
          }}
        />
        {!isCameraOn && (
          <Avatar
            size={64}
            src={streamData.participant.avatar}
            alt={streamData.participant.fullname}
            style={{
              borderRadius: "12px",
            }}
          />
        )}

        <Typography
          color="white"
          sx={{
            backgroundColor: "#212121",
            borderRadius: "80px",
            padding: "4px 16px",
            display: "inline-block",
            ...(isCameraOn
              ? {
                  position: "absolute",
                  bottom: "8px",
                }
              : {}),
          }}
        >
          {streamData.participant.fullname}
        </Typography>
      </Box>
      <Box
        sx={[
          isMicOn
            ? isDarkMode
              ? sxBtnCircleActiveDark
              : {
                  borderRadius: "50%",
                  background: "#3699FF",
                  "&:hover": {
                    bgcolor: "#3699FF",
                  },
                }
            : {
                borderRadius: "50%",
                backgroundColor: "#F64E60",
                color: "#F64E60",
                "&:hover": {
                  bgcolor: "#F64E60",
                  color: "#F64E60",
                },
              },
          {
            position: "absolute",
            right: 16,
            top: 16,
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          },
        ]}
      >
        {isMicOn ? (
          <MicrophoneIconV1
            sx={{
              position: "relative",
              left: "1px",
            }}
          />
        ) : (
          <MicrophoneSlashIcon />
        )}
      </Box>
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
        {isRaiseHand && (
          <Typography
            sx={{
              color: "white",
              fontSize: "30px",
              userSelect: "none",
            }}
          >
            ✋
          </Typography>
        )}
        <Emoji unified={reactionUnified} size={30} />
      </Box>
    </Box>
  );
};

export default VideoParticipant;
