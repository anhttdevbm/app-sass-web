/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from "@mui/material";
import Avatar from "components/Avatar";
import { sxBtnCircleActiveDark } from "components/sn-meeting/style";
import { Emoji } from "emoji-picker-react";
import useTheme from "hooks/useTheme";
import { MicrophoneIconV1 } from "icons/MicrophoneIconV1";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";
import { useAppSelector } from "store/hooks";
import { updateRemoteStreamState } from "store/meeting/reducer";
import { ParticipantStreamEvent, RemoteStream } from "store/meeting/types";
import ButtonOnMyScreen from "../ButtonOnMyScreen";

const ParticipantCard = ({ remoteStream }: { remoteStream: RemoteStream }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { participant, stream, streamState } = remoteStream;
  const { isDarkMode } = useTheme();
  const { isCameraOn, isRaiseHand, reactionUnified, isMicOn } = streamState;
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, []);
  useEffect(() => {
    if (reactionUnified) {
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
  }, [reactionUnified]);
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: "none",
        "&:hover #btn_screen": {
          display: "block",
        },
      }}
    >
      {!isCameraOn && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${
              participant.avatar
                ? participant.avatar
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
          autoPlay
          style={{
            width: isCameraOn ? "100%" : "0%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {!isCameraOn && (
          <Avatar
            size={64}
            src={participant.avatar}
            alt={participant.fullname}
            style={{
              borderRadius: "12px",
            }}
          />
        )}
      </Box>

      <Box
        id="mic-ui"
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

      <CardContent
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
          {participant.fullname}
        </Typography>
      </CardContent>
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
      {!isCameraOn && (
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
            display: "none",
          }}
          isLocalStream={true}
          localStream={stream}
          streamState={streamState}
        />
      )}
    </Card>
  );
};

const GalleryLayout = () => {
  const { remoteStreams, localStream, localStreamState } = useAppSelector(
    (state) => state.meeting,
  );
  const { user } = useAuth();
  const localStreamData: RemoteStream = useMemo(() => {
    return {
      participant: {
        id: user?.id || "",
        fullname: user?.fullname || "",
        avatar: user?.avatar || "",
        position: user?.position?.name || "",
        username: user?.name || "",
      },
      stream: localStream as MediaStream,
      streamState: localStreamState,
    };
  }, [localStreamState]);

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {[localStreamData, ...remoteStreams].map((remoteStream) => (
          <Grid
            item
            xs={6}
            key={remoteStream.participant.id}
            sx={{ height: "50%" }}
          >
            <ParticipantCard remoteStream={remoteStream} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GalleryLayout;
