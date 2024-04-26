"use client";

import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import AddCircleIcon from "icons/AddCircleIcon";
import React, { useState } from "react";
import MeetingHeaderLayout from "../MeetingHeaderLayout";
import OptionButtonsLayout from "../OptionButtonLayout";
import RightSidebar from "../right-sidebar/RightSidebar";
import VideoScreen from "../VideoScreen";
import useBreakpoint from "hooks/useBreakpoint";
import useWindowSize from "hooks/useWindowSize";

export default function MeetingLayout() {
  const [active, setActive] = useState(false);

  const breack = useBreakpoint();
  const size = useWindowSize();

  return (
    <Card>
      <Stack
        direction="row"
        alignItems="stretch"
        spacing={3}
        justifyContent={"space-between"}
        p={2}
      >
        <Stack
          direction={"column"}
          sx={{ width: "calc(100% - 400px)", backgroundColor: "white" }}
        >
          <MeetingHeaderLayout sx={{}} />
          <VideoScreen sx={{}} users={initUsers} />
          <OptionButtonsLayout sx={{}} />
        </Stack>

        <RightSidebar />
      </Stack>
    </Card>
  );
}

const initUsers = [
  {
    id: '1',
    name: "John Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: true,
    isCameraOn: true,
    isSpeaker: true,
  },
  {
    id: '2',
    name: "Mark Smith",
    avatar: "https://via.placeholder.com/150",
    isMicOn: false,
    isCameraOn: false,
    isSpeaker: false,
  },
  {
    id: '3',
    name: "Frank Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: true,
    isCameraOn: false,
    isSpeaker: true,
  },
  {
    id: '4',
    name: "Hoang Van Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: false,
    isCameraOn: true,
    isSpeaker: false,
  },
  {
    id: '5',
    name: "Steven Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: true,
    isCameraOn: false,
    isSpeaker: false,
  },
  {
    id: '6',
    name: "Steven Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: true,
    isCameraOn: false,
    isSpeaker: false,
  },
];

const initMessagesArray = [
  {
    user: {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Hello, how are you?",
  },
  {
    user: {
      id: 2,
      name: "Mark Smith",
      avatar: "https://via.placeholder.com/150",
    },
    message: "I'm doing great, thanks!",
  },
  {
    user: {
      id: 3,
      name: "Frank Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Nice to meet you!",
  },
  {
    user: {
      id: 4,
      name: "Hoang Van Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Hello everyone!",
  },
  {
    user: {
      id: 5,
      name: "Steven Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "Good morning!",
  },
  {
    user: {
      id: 6,
      name: "Steven Doe",
      avatar: "https://via.placeholder.com/150",
    },
    message: "How's everyone doing?",
  },
];