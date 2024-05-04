import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { sxBtn, sxPrimaryBtn } from "../../style";
import ListUser from "./ListUser";
import Conversation from "./Converstaion";

const RightSidebar = () => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [typeShow, setTypeShow] = useState<'message'|'participants'>('participants');

  const toggleIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleTypeShow = () => {
    setTypeShow(typeShow === 'message' ? 'participants' : 'message');
  };

  return (
    <Stack direction={"column"} sx={{ width: 400, backgroundColor: "#ccc" }}>
      <Box textAlign={"center"}>
        <Button
          sx={{ ...sxBtn, width: "60%", borderRadius: "20px" }}
          startIcon={<AddCircleIcon />}
        >
          Add Participant
        </Button>
      </Box>
      <Stack
        direction={"row"}
        bgcolor={"white"}
        // textAlign={"center"}
        justifyContent={"center"}
        py={1}
      >
        <Button
          onClick={toggleTypeShow}
          sx={typeShow === 'message' ? activeButton : unActiveButton}
        >
          Message
        </Button>
        <Button
          onClick={toggleTypeShow}
          sx={typeShow === 'participants' ? activeButton : unActiveButton}
        >
          Participants <span>24</span>
        </Button>
      </Stack>
      <Box>
      {typeShow === 'message' && <Conversation messages={[]} />}
      {typeShow === 'participants' && <ListUser users={[]}/>}
      </Box>
    </Stack>
  );
};

export default RightSidebar;

const activeButton = {
  ...sxPrimaryBtn,
  width: "40%",
  borderRadius: "10px",
};

const unActiveButton = {
  ...sxBtn,
  width: "40%",
  borderRadius: "10px",
};


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