import {
  AddReaction,
  BackHand,
  ClosedCaption,
  Mic,
  Pending,
  RadioButtonChecked,
  RecordVoiceOverSharp,
  ScreenShare,
  VideocamOutlined,
} from "@mui/icons-material";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import { sxBtnCircleActive, sxDangerBtn } from "../../style";
import React, { useState } from "react";
import OptionPopup from "./OptionPopup";
import { random } from "lodash";

interface OptionButtonLayoutProps {
  sx: object;
}

export default function OptionButtonsLayout(props: OptionButtonLayoutProps) {
  const [isMicActive, setIsMicActive] = useState(false);
  const [isVideocamActive, setIsVideocamActive] = useState(false);
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);
  const [isRadioButtonActive, setIsRadioButtonActive] = useState(false);
  const [isClosedCaptionActive, setIsClosedCaptionActive] = useState(false);
  const [isAddReactionActive, setIsAddReactionActive] = useState(false);
  const [isBackHandActive, setIsBackHandActive] = useState(false);
  const [isPendingActive, setIsPendingActive] = useState(false);

  const handleMicButtonClick = () => {
    setIsMicActive(!isMicActive);
  };

  const handleVideocamButtonClick = () => {
    setIsVideocamActive(!isVideocamActive);
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

  return (
    <Stack direction="row" sx={{ ...props.sx }}>
      <Box textAlign={"center"} width={"80%"} position={"relative"}>
        <ButtonGroup
          component="div"
          variant="contained"
          aria-label="outlined button group"
          sx={{
            gap: "20px",
            textAlign: "center",
          }}
        >
          <IconButton
            sx={sxBtnCircleActive}
            color={isMicActive ? "primary" : "default"}
            onClick={handleMicButtonClick}
          >
            <Mic />
          </IconButton>
          <IconButton
            sx={sxBtnCircleActive}
            color={isVideocamActive ? "primary" : "default"}
            onClick={handleVideocamButtonClick}
          >
            <VideocamOutlined />
          </IconButton>
          <IconButton
            sx={sxBtnCircleActive}
            color={isScreenShareActive ? "primary" : "default"}
            onClick={handleScreenShareButtonClick}
          >
            <ScreenShare />
          </IconButton>
          <IconButton
            sx={sxBtnCircleActive}
            color={isRadioButtonActive ? "primary" : "default"}
            onClick={handleRadioButtonButtonClick}
          >
            <RadioButtonChecked />
          </IconButton>
          <IconButton
            sx={sxBtnCircleActive}
            color={isClosedCaptionActive ? "primary" : "default"}
            onClick={handleClosedCaptionButtonClick}
          >
            <ClosedCaption />
          </IconButton>
          <IconButton
            sx={sxBtnCircleActive}
            color={isAddReactionActive ? "primary" : "default"}
            onClick={handleAddReactionButtonClick}
          >
            <AddReaction />
          </IconButton>
          <IconButton
            sx={sxBtnCircleActive}
            color={isBackHandActive ? "primary" : "default"}
            onClick={handleBackHandButtonClick}
          >
            <BackHand />
          </IconButton>
          <Button
            sx={{
              ...sxBtnCircleActive,
            }}
            onClick={handlePendingButtonClick}
            aria-describedby={idPopup}
            variant="contained"
          >
            <Pending />
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

      <Box width={"20%"} textAlign={"center"}>
        <Button sx={sxDangerBtn}>End Call</Button>
      </Box>
    </Stack>
  );
}
