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
import {
  sxBtnCircleActive,
  sxBtnCircleActiveDark,
  sxBtnCircleActiveLight,
  sxDangerBtn,
} from "../../style";
import React, { useState } from "react";
import OptionPopup from "./OptionPopup";
import { random } from "lodash";
import useTheme from "hooks/useTheme";

interface OptionButtonLayoutProps {
  sx: object;
}

export default function OptionButtonsLayout(props: OptionButtonLayoutProps) {
  const { isDarkMode } = useTheme();
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
    <Stack
      direction="row"
      p={2.5}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        ...props.sx,
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
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isMicActive ? "primary" : "default"}
            onClick={handleMicButtonClick}
            style={{ width: "64px", height: "64px" }}
          >
            <Mic />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isVideocamActive ? "primary" : "default"}
            onClick={handleVideocamButtonClick}
            style={{ width: "64px", height: "64px" }}
          >
            <VideocamOutlined />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isScreenShareActive ? "primary" : "default"}
            onClick={handleScreenShareButtonClick}
            style={{ width: "64px", height: "64px" }}
          >
            <ScreenShare />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isRadioButtonActive ? "primary" : "default"}
            onClick={handleRadioButtonButtonClick}
            style={{ width: "64px", height: "64px" }}
          >
            <RadioButtonChecked />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isClosedCaptionActive ? "primary" : "default"}
            onClick={handleClosedCaptionButtonClick}
            style={{ width: "64px", height: "64px" }}
          >
            <ClosedCaption />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isAddReactionActive ? "primary" : "default"}
            onClick={handleAddReactionButtonClick}
            style={{ width: "64px", height: "64px" }}
          >
            <AddReaction />
          </IconButton>
          <IconButton
            sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
            color={isBackHandActive ? "primary" : "default"}
            onClick={handleBackHandButtonClick}
            style={{ width: "64px", height: "64px" }}
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
              width: "64px",
              height: "64px",
              boxShadow: "none",
            }}
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

      <Box width={"10%"} textAlign={"center"}>
        <Button sx={{ padding: "14px", ...sxDangerBtn }}>End Call</Button>
      </Box>
    </Stack>
  );
}
