"use client";

import { Card, Stack } from "@mui/material";

import useTheme from "hooks/useTheme";
import { useState } from "react";
import { useWSChatConnect } from "store/chat/ws";
import VideoScreen from "../components/VideoScreen";
import MeetingHeaderLayout from "./MeetingHeaderLayout";
import OptionButtonsLayout from "./footer/OptionButtonLayout";
import RightSidebar from "./right-sidebar/RightSidebar";

export default function MeetingLayout() {
  useWSChatConnect();
  const { isDarkMode } = useTheme();
  const [toggleMinimize, setToggleMinimize] = useState(false);

  const toggleMinimizeMeeting = () => {
    setToggleMinimize(!toggleMinimize);
  };

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        borderRadius: 0,
        padding: "24px",
        background: "#F5F5FD",
      }}
    >
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
        pb={0}
        sx={{ height: "100%" }}
      >
        <Stack
          direction={"column"}
          gap={3.5}
          sx={{
            width: "calc(100% - 400px)",
            backgroundColor: isDarkMode
              ? "var(--mui-palette-grey-50)"
              : "white",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <MeetingHeaderLayout
            sx={{ px: 3 }}
            toggleMinimizeMeeting={toggleMinimizeMeeting}
          />
          <VideoScreen sx={{ flex: 1, px: 3 }} />

          <OptionButtonsLayout
            sx={{
              width: "100%",
              boxShadow: "0 -3px 20px 1px #00000026",
              flexShrink: 0,
            }}
          />
        </Stack>
        <RightSidebar />
      </Stack>
    </Card>
  );
}
