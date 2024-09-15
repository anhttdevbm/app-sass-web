import { BackHand, ClosedCaption, ScreenShare } from "@mui/icons-material";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import ReactionButton from "components/sn-meeting/components/ReactionButton";
import RecordButton from "components/sn-meeting/components/RecordButton";
import PopupModalSetting from "components/sn-meeting/components/modal-settings/PopupModalSetting";
import useTheme from "hooks/useTheme";
import { MicrophoneIcon } from "icons/MicrophoneIcon";
import { MicrophoneSlashIcon } from "icons/MicrophoneSlashIcon";
import ThreeDotsIcon from "icons/ThreeDotsIcon";
import { VideoIcon } from "icons/VideoIcon";
import { VideoSlashIcon } from "icons/VideoSlashIcon";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";
import { setLocalStream, setLocalStreamState } from "store/meeting/reducer";
import { useMeeting } from "store/meeting/selectors";
import {
  MeetRoomInfo,
  ParticipantStreamEvent,
  ParticipantAction,
} from "store/meeting/types";
import {
  sxBtnCircleActiveDark,
  sxBtnCircleActiveLight,
  sxDangerBtn,
} from "../../style";
import OptionPopup from "./OptionPopup";
import { useAppSelector } from "store/hooks";
import {
  WSParticipantActionPayload,
  WSParticipantActionType,
} from "components/sn-meeting/type";

interface OptionButtonLayoutProps {
  sx: object;
}

export default function OptionButtonsLayout(props: OptionButtonLayoutProps) {
  const { isDarkMode } = useTheme();
  const { meetInfo, localStream, localStreamState, peer, meetingWsClient } =
    useAppSelector((state) => state.meeting);
  const { user } = useAuth();
  const { onLeaveMeeting, onUpdateMeetingStatus } = useMeeting();
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);
  const [isRadioButtonActive, setIsRadioButtonActive] = useState(false);
  const [isClosedCaptionActive, setIsClosedCaptionActive] = useState(false);
  const [isAddReactionActive, setIsAddReactionActive] = useState(false);
  const [isBackHandActive, setIsBackHandActive] = useState(false);
  const { id } = useParams();
  const [anchorElCap, setAnchorElCap] = useState<null | HTMLElement>(null);
  const [anchorElMoreButton, setAnchorElMoreButton] =
    useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCap(anchorElCap ? null : event.currentTarget);
  };

  const onClickMoreButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMoreButton(anchorElMoreButton ? null : event.currentTarget);
  };

  const onCloseSetting = () => {
    setAnchorElCap(null);
  };

  const handleMicButtonClick = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !localStreamState.isMicOn;
    });
    const newLocalStreamState = {
      ...localStreamState,
      isMicOn: !localStreamState.isMicOn,
    };
    store.dispatch(setLocalStreamState(newLocalStreamState));
    const action: ParticipantAction = {
      event: ParticipantStreamEvent.TOGGLE_MIC,
      participantId: user?.id as string,
      status: newLocalStreamState.isMicOn,
    };
    const payload: WSParticipantActionPayload = {
      event: "signal",
      type: WSParticipantActionType.PARTICIPANT_ACTION,
      payload: action,
    };

    meetingWsClient?.send(JSON.stringify(payload));
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

    const action: ParticipantAction = {
      event: ParticipantStreamEvent.TOGGLE_CAMERA,
      participantId: user?.id as string,
      status: newLocalStreamState.isCameraOn,
    };
    const payload: WSParticipantActionPayload = {
      event: "signal",
      type: WSParticipantActionType.PARTICIPANT_ACTION,
      payload: action,
    };
    meetingWsClient?.send(JSON.stringify(payload));
  };

  const handleScreenShareButtonClick = async () => {
    try {
      const displayMedia = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      store.dispatch(setLocalStream(displayMedia));
      displayMedia.getVideoTracks()[0].addEventListener("ended", () => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            {
              store.dispatch(setLocalStream(stream));
              peer.streams[0].getVideoTracks()[0].stop();

              peer.replaceTrack(
                peer.streams[0].getVideoTracks()[0],
                stream.getVideoTracks()[0],
                peer.streams[0],
              );
            }
          });
      });
      if (peer) {
        peer.streams[0].getVideoTracks()[0].stop();

        peer.replaceTrack(
          peer.streams[0].getVideoTracks()[0],
          displayMedia.getVideoTracks()[0],
          peer.streams[0],
        );
      }
    } catch (e) {
      console.log(e);
    }
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
        overflowY: "auto",
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
          <RecordButton />
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isClosedCaptionActive ? "primary" : "default"}
            onClick={handleClick}
            style={{ width: "40px", height: "40px" }}
          >
            <ClosedCaption />
          </IconButton>
          <ReactionButton />
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
            onClick={onClickMoreButton}
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

        {/* More Action */}
        <OptionPopup
          anchorElP={anchorElMoreButton}
          onClose={() => setAnchorElMoreButton(null)}
        />
      </Box>

      <Box marginLeft="12px" textAlign={"center"}>
        <Button
          sx={{ padding: "0", height: "32px", ...sxDangerBtn }}
          onClick={leaveMeeting}
        >
          End Call
        </Button>
      </Box>

      {/* Popup modal for Setting and Capion  */}
      <PopupModalSetting anchorEl={anchorElCap} onClose={onCloseSetting} />
    </Stack>
  );
}
