import { Box, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useState } from "react";

import MyVideoScreen from "./MyVideoScreen";
import ParticipantList from "./ParticipantList";
import { store } from "store/configureStore";
import OneToOneCallLayout from "./OneToOneCallLayout";
import { useAppSelector } from "store/hooks";
import { LayoutType } from "../type";
import GalaryLayout from "./screen-layout/GalaryLayout";
import { useChat } from "store/chat/selectors";
import FocusOnContentLayout from "./screen-layout/FocusOnContentLayout";
import SpeakerLayout from "./screen-layout/SpeakerLayout";

interface VideoScreenProps {
  sx: object;
}

const VideoScreen: React.FC<VideoScreenProps> = (props: VideoScreenProps) => {
  const { sx } = props;
  const { meetingLayout, meetInfo } = useAppSelector((state) => state.meeting);

  if (meetInfo?.room?.type === "p") {
    return <OneToOneCallLayout />;
  }

  return (
    <Box className="" sx={{ ...sx, maxHeight: "100%", height: "200px" }}>
      {meetingLayout === LayoutType.GALARY && <GalaryLayout />}
      {meetingLayout === LayoutType.SPEAKER && (
        <Stack
          component={"div"}
          spacing={1}
          sx={{ justifyContent: "space-between", height: "100%" }}
        >
          {meetInfo?.room?.type === "g" ? (
            <SpeakerLayout />
          ) : (
            <OneToOneCallLayout />
          )}
        </Stack>
      )}
      {meetingLayout === LayoutType.FOCUS_ON_CONTENT && (
        <FocusOnContentLayout />
      )}
    </Box>
  );
};

export default VideoScreen;
