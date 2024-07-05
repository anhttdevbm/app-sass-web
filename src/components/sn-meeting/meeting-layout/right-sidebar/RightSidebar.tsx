import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { sxBtn, sxPrimaryBtn } from "../../style";
import ListUser from "./ListUser";
import Conversation from "./Converstaion";
import useTheme from "hooks/useTheme";

const RightSidebar = () => {
  const { isDarkMode } = useTheme();

  const [isActive, setIsActive] = useState<boolean>(true);
  const [typeShow, setTypeShow] = useState<"message" | "participants">(
    "participants",
  );

  const toggleIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleTypeShow = () => {
    setTypeShow(typeShow === "message" ? "participants" : "message");
  };

  return (
    <Stack
      direction={"column"}
      sx={{
        width: 400,
        backgroundColor: isDarkMode ? "var(--mui-palette-grey-50)" : "#F5F5FD",
        height: "calc(100vh - 50px)",
      }}
    >
      <Box textAlign={"center"} py={2} bgcolor={isDarkMode ? "#000" : "#fff"}>
        <Button
          sx={{
            ...sxBtn,
            width: "60%",
            borderRadius: "20px",
            textTransform: "capitalize",
          }}
          startIcon={<AddCircleIcon />}
        >
          Add Participant
        </Button>
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        py={2}
        borderBottom={1}
        borderColor={isDarkMode ? "#000" : "#ECECF3"}
      >
        <Box
          sx={{
            bgcolor: isDarkMode ? "#3a3b3c" : "#fff",
            borderRadius: 1,
            padding: 0.5,
            width: "90%",
          }}
        >
          <Button
            onClick={toggleTypeShow}
            sx={
              typeShow === "message"
                ? activeButton
                : [unActiveButton, { bgcolor: isDarkMode ? "#3a3b3c" : "#fff" }]
            }
          >
            Messages
          </Button>
          <Button
            onClick={toggleTypeShow}
            sx={
              typeShow === "participants"
                ? activeButton
                : [unActiveButton, { bgcolor: isDarkMode ? "#3a3b3c" : "#fff" }]
            }
          >
            Participants
            <span
              style={typeShow === "participants" ? activeBadge : inActiveBadge}
            >
              24
            </span>
          </Button>
        </Box>
      </Stack>
      {typeShow === "message" && <Conversation messages={initMessagesArray} />}
      {typeShow === "participants" && <ListUser users={[]} />}
    </Stack>
  );
};

export default RightSidebar;

const activeButton = {
  ...sxPrimaryBtn,
  width: "50%",
  borderRadius: "6px",
  padding: "8px 16px",
  gap: 1,
  textTransform: "capitalize",
};

const unActiveButton = {
  ...sxBtn,
  width: "50%",
  borderRadius: "6px",
  padding: "8px 16px",
  gap: 1,
  textTransform: "capitalize",
};

const activeBadge = {
  borderRadius: "20px",
  background: "#fff",
  color: "#000",
  padding: "0 8px",
};

const inActiveBadge = {
  borderRadius: "20px",
  background: "#EEF2F6",
  color: "#000",
  padding: "0 8px",
};

const initMessagesArray = [
  {
    user: {
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
    },
    content: "Hello, how are you?",
    time: "10:54",
    id: "1",
  },
  {
    user: {
      name: "Mark Smith",
      avatar: "https://via.placeholder.com/150",
    },
    id: "2",
    content: "I'm doing great, thanks!",
    time: "10:54",
  },
  {
    user: {
      name: "Frank Doe",
      avatar: "https://via.placeholder.com/150",
    },
    id: "3",
    content: "Nice to meet you!",
    time: "10:54",
  },
  {
    user: {
      name: "Hoang Van Doe",
      avatar: "https://via.placeholder.com/150",
    },
    id: "4",
    content: "Hello everyone!",
    time: "10:54",
  },
  {
    user: {
      name: "Steven Doe",
      avatar: "https://via.placeholder.com/150",
    },
    id: "5",
    content: "Good morning!",
    time: "10:54",
  },
  {
    user: {
      name: "Steven Doe",
      avatar: "https://via.placeholder.com/150",
    },
    id: "6",
    content: "How's everyone doing?",
    time: "10:54",
  },
];
