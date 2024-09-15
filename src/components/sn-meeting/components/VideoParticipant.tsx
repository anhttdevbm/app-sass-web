import { Box } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import useTheme from "hooks/useTheme";
import { MicrophoneIconV1 } from "icons/MicrophoneIconV1";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import { useEffect, useRef } from "react";
import { RemoteStream } from "store/meeting/types";
import { sxBtnCircleActiveDark } from "../style";

interface VideoParticipantProps {
  streamData: RemoteStream;
}

const VideoParticipant = ({ streamData }: VideoParticipantProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDarkMode } = useTheme();
  const isCameraOn = streamData.streamState?.isCameraOn;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = streamData.stream || null;
    }
  }, []);

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
        height: "120px",
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
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <video
          ref={videoRef}
          width={isCameraOn ? "100%" : "0%"}
          height="100%"
          autoPlay
          style={{
            objectFit: "cover",
          }}
        />
        {!isCameraOn && (
          <Avatar
            size={40}
            src={streamData.participant.avatar}
            alt={streamData.participant.fullname}
          />
        )}
      </Box>
      <Box
        sx={[
          streamData.streamState.isMicOn
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
        {streamData.streamState.isMicOn ? (
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
      <Text
        sx={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "#000",
          color: "#fff",
          borderRadius: "90px",
          padding: "4px 12px",
          width: "max-content",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        {streamData.participant.fullname}
      </Text>
    </Box>
  );
};

export default VideoParticipant;
