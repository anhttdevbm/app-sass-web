import { Box, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { sxBtnCircleActiveDark } from "components/sn-meeting/style";
import useTheme from "hooks/useTheme";
import { MicrophoneIconV1 } from "icons/MicrophoneIconV1";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "store/app/selectors";
import { useAppSelector } from "store/hooks";

export default function FocusOnContentLayout() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { localStream, localStreamState, remoteStreams } = useAppSelector(
    (state) => state.meeting,
  );
  const videoLocalRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStream = useMemo(() => {
    return remoteStreams.length > 0 ? remoteStreams[0] : null;
  }, [remoteStreams]);
  useEffect(() => {
    if (videoRef.current && remoteStreams.length > 0) {
      videoRef.current.srcObject = remoteStreams[0].stream;
    }
  }, [remoteStreams]);

  useEffect(() => {
    if (videoLocalRef.current && localStream) {
      videoLocalRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#f0f0f0",
        position: "relative",
      }}
    >
      {/* Main video content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#000",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          style={{
            width:
              remoteStream && remoteStream.streamState.isCameraOn
                ? "100%"
                : "0%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "12px",
          }}
        />

        {
          <video
            ref={videoLocalRef}
            autoPlay
            style={{
              width:
                !remoteStream && localStreamState.isCameraOn ? "100%" : "0%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />
        }
        {!remoteStream && !localStreamState.isCameraOn && (
          <Avatar size={40} src={user?.avatar} alt={user?.fullname} />
        )}
      </Box>

      <Box
        id="mic-ui"
        sx={[
          remoteStream?.streamState.isMicOn
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
            bottom: 16,
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          },
        ]}
      >
        {remoteStream?.streamState.isMicOn ? (
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
          backgroundColor: "rgba(0,0,0,0.3)",
          position: "absolute",
          bottom: "16px",
          left: "16px",
          padding: "8px 24px !important",
          borderRadius: "80px",
          zIndex: 99,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#fff",
            fontWeight: "700",
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          {remoteStream ? remoteStream?.participant.fullname : user?.fullname}
        </Typography>
      </Box>

      {/* Top-left participant */}
      {
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: "12px",
            width: "250px",
            aspectRatio: "1.33333",
            zIndex: 99,
            visibility: remoteStream ? "visible" : "hidden",
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
                  false ? false : "/images/img-user-placeholder.webp"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px)",
                zIndex: 0,
              }}
            />
          )}
          <video
            autoPlay
            muted
            ref={videoLocalRef}
            style={{
              width:
                remoteStream && localStreamState.isCameraOn ? "100%" : "0%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />
          {!localStreamState.isCameraOn && (
            <Avatar
              size={64}
              src={user?.avatar}
              alt={user?.fullname}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
          <Box
            sx={{
              width: "100%",
              zIndex: 99,
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              color="white"
              sx={{
                backgroundColor: "#212121",
                borderRadius: "80px",
                padding: "4px 16px",
                display: "inline-block",
              }}
            >
              {user?.fullname}
            </Typography>
          </Box>
        </Box>
      }
    </Box>
  );
}
