import {
  AddReaction,
  BackHand,
  ClosedCaption,
  RadioButtonChecked,
  ScreenShare,
} from "@mui/icons-material";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import useTheme from "hooks/useTheme";
import { MicrophoneIcon } from "icons/MicrophoneIcon";
import ThreeDotsIcon from "icons/ThreeDotsIcon";
import { VideoIcon } from "icons/VideoIcon";
import { random } from "lodash";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { store } from "store/configureStore";
import { useMeeting } from "store/meeting/selectors";
import {
  sxBtnCircleActiveDark,
  sxBtnCircleActiveLight,
  sxDangerBtn,
} from "../../style";
import OptionPopup from "./OptionPopup";
import { RecordCircleIcon } from "icons/RecordCircleIcon";
import { setLocalStream, setLocalStreamState } from "store/meeting/reducer";
import { useAuth } from "store/app/selectors";
import { VideoSlashIcon } from "icons/VideoSlashIcon";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import {
  MeetRoomInfo,
  ParticipantStreamEvent,
  ParticipantStreamEventPayload,
} from "store/meeting/types";

interface OptionButtonLayoutProps {
  sx: object;
}

export default function OptionButtonsLayout(props: OptionButtonLayoutProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const {
    meetingWsClient: ws,
    currentParticipants,
    meetInfo,
    localStream,
    localStreamState,
    peer,
    remoteStreams,
  } = store.getState().meeting;
  const { user } = useAuth();
  const { onLeaveMeeting, onUpdateMeetingStatus } = useMeeting();
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);
  const [isRadioButtonActive, setIsRadioButtonActive] = useState(false);
  const [isClosedCaptionActive, setIsClosedCaptionActive] = useState(false);
  const [isAddReactionActive, setIsAddReactionActive] = useState(false);
  const [isBackHandActive, setIsBackHandActive] = useState(false);
  const [isPendingActive, setIsPendingActive] = useState(false);
  const { id } = useParams();

  const handleMicButtonClick = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !localStreamState.isMicOn;
    });
    const newLocalStreamState = {
      ...localStreamState,
      isMicOn: !localStreamState.isMicOn,
    };
    // localStream && store.dispatch(setLocalStream(new MediaStream(localStream)))
    store.dispatch(setLocalStreamState(newLocalStreamState));
    const payload: ParticipantStreamEventPayload = {
      event: ParticipantStreamEvent.TOGGLE_MIC,
      participantId: user?.id as string,
      status: newLocalStreamState.isMicOn,
    };

    peer?.send(JSON.stringify(payload));
  };

  const handleVideocamButtonClick = () => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !localStreamState.isCameraOn;
    });
    const newLocalStreamState = {
      ...localStreamState,
      isCameraOn: !localStreamState.isCameraOn,
    };
    store.dispatch(setLocalStreamState(newLocalStreamState));

    const payload: ParticipantStreamEventPayload = {
      event: ParticipantStreamEvent.TOGGLE_CAMERA,
      participantId: user?.id as string,
      status: newLocalStreamState.isCameraOn,
    };

    peer?.send(JSON.stringify(payload));
  };

  const handleScreenShareButtonClick = () => {
    setIsScreenShareActive(!isScreenShareActive);
  };

  const handleRadioButtonButtonClick = () => {
    setIsRadioButtonActive(!isRadioButtonActive);
  };

  const handleClosedCaptionButtonClick = () => {
    setIsClosedCaptionActive(!isClosedCaptionActive);
  };

  const handleAddReactionButtonClick = () => {
    setIsAddReactionActive(!isAddReactionActive);
  };

  const handleBackHandButtonClick = () => {
    setIsBackHandActive(!isBackHandActive);
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePendingButtonClick = (event) => {
    setIsPendingActive(!isPendingActive);
    setAnchorEl(anchorEl ? null : event.currentTarget);

    console.log("IsPendingActive ", isPendingActive);
  };

  const idPopup = random().toString();

  const leaveMeeting = async () => {
    localStream?.getTracks().forEach((track) => track.stop());
    // Use fake meetInfo for get Room Id if connect fail
    const fakeMeetInfo: MeetRoomInfo = {
      id: "",
      created_at: "",
      host: {
        avatar: "",
        id: "",
        fullname: "",
        username: "",
        position: "",
      },
      room: {
        id: id as string,
        members: [],
        type: "p",
      },
    };

    await onLeaveMeeting(meetInfo?.room?.id ? meetInfo : fakeMeetInfo);
    onUpdateMeetingStatus(true);
  };

  return (
    <Stack
      direction="row"
      padding="12px"
      sx={{
        ...props.sx,
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "auto hidden",
        "& svg": {
          width: "20px",
          height: "20px",
        },
      }}
    >
      <Box textAlign={"center"} position={"relative"} sx={{ flexGrow: 1 }}>
        <ButtonGroup
          component="div"
          // variant="contained"
          aria-label="outlined button group"
          sx={{
            gap: 1.5,
            textAlign: "center",
          }}
        >
          <IconButton
            sx={
              isDarkMode
                ? sxBtnCircleActiveDark
                : {
                    ...sxBtnCircleActiveLight,
                    "&:hover > svg > path:not(:first-of-type)": {
                      fill: localStreamState.isMicOn ? "#FFF" : "#F64E60",
                      stroke: localStreamState.isMicOn ? "#FFF" : "#F64E60",
                    },
                  }
            }
            color={localStreamState.isMicOn ? "primary" : "default"}
            onClick={handleMicButtonClick}
            style={{ width: "40px", height: "40px" }}
          >
            {localStreamState.isMicOn ? (
              <MicrophoneIcon />
            ) : (
              <MicrophoneSlashIcon
                sx={{
                  "& path": {
                    stroke: "#F64E60",
                    fill: "#F64E60",
                  },
                }}
              />
            )}
          </IconButton>
          <IconButton
            sx={
              isDarkMode
                ? sxBtnCircleActiveDark
                : {
                    ...sxBtnCircleActiveLight,
                    "&:hover > svg > path": {
                      fill: localStreamState.isCameraOn ? "#FFF" : "#F64E60",
                      stroke: localStreamState.isCameraOn ? "#FFF" : "#F64E60",
                    },
                    "&:hover > svg > path:last-of-type": {
                      fill: localStreamState.isCameraOn ? "#3699FF" : "#F64E60",
                      stroke: localStreamState.isCameraOn
                        ? "#3699FF"
                        : "#F64E60",
                    },
                  }
            }
            color={localStreamState.isCameraOn ? "primary" : "default"}
            onClick={handleVideocamButtonClick}
            style={{ width: "40px", height: "40px" }}
          >
            {localStreamState.isCameraOn ? (
              <VideoIcon
                sx={{
                  "& path": {
                    stroke: "#3699FF",
                  },
                }}
              />
            ) : (
              <VideoSlashIcon />
            )}
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isScreenShareActive ? "primary" : "default"}
            onClick={handleScreenShareButtonClick}
            style={{ width: "40px", height: "40px" }}
          >
            <ScreenShare />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isRadioButtonActive ? "primary" : "default"}
            onClick={handleRadioButtonButtonClick}
            style={{ width: "40px", height: "40px" }}
          >
            <RecordCircleIcon
              sx={{
                "& path": {
                  fill: "currentcolor",
                  stroke: "currentcolor",
                },
              }}
            />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isClosedCaptionActive ? "primary" : "default"}
            onClick={handleClosedCaptionButtonClick}
            style={{ width: "40px", height: "40px" }}
          >
            <ClosedCaption />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isAddReactionActive ? "primary" : "default"}
            onClick={handleAddReactionButtonClick}
            style={{ width: "40px", height: "40px" }}
          >
            <AddReaction />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isBackHandActive ? "primary" : "default"}
            onClick={handleBackHandButtonClick}
            style={{ width: "40px", height: "40px" }}
          >
            <BackHand />
          </IconButton>
          <Button
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            onClick={handlePendingButtonClick}
            aria-describedby={idPopup}
            variant="contained"
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              boxShadow: "none",
            }}
          >
            <ThreeDotsIcon
              sx={{
                rotate: "90deg",
                width: "18px",
                height: "18px",
              }}
            />
          </Button>
        </ButtonGroup>

        {isPendingActive && (
          <OptionPopup
            sx={{}}
            idPopup={idPopup}
            isShown={isPendingActive}
            anchorElP={anchorEl}
          />
        )}
      </Box>

      <Box marginLeft="12px" textAlign={"center"}>
        <Button
          sx={{ padding: "0", height: "32px", ...sxDangerBtn }}
          onClick={leaveMeeting}
        >
          End Call
        </Button>
      </Box>
    </Stack>
  );
}
