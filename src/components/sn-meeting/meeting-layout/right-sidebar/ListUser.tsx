import { Mic, MicOff, Videocam, VideocamOff, VideocamOutlined } from "@mui/icons-material";
import { Stack, Avatar, Box, Grid } from "@mui/material";
import { IconButton, Text } from "components/shared";
import React, { useState } from "react";
import ItemUser from "./ItemUser";

interface User {
  id: string;
  avatar: string;
  name: string;
  isMicOn: boolean;
  isCameraOn: boolean;
}

interface ListUserProps {
  users: User[];
}

const ListUser: React.FC<ListUserProps> = ({ users }) => {

  return (
    <Stack direction={"column"}>
      {initUsers.map((user) => (
        <ItemUser user={user} key={user.id} />
      ))}
    </Stack>
  );
};

export default ListUser;

const initUsers = [
  {
    id: '1',
    name: "John Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: true,
    isCameraOn: true,
  },
  {
    id: "2",
    name: "Mark Smith",
    avatar: "https://via.placeholder.com/150",
    isMicOn: false,
    isCameraOn: false,
  },
  {
    id: "3",
    name: "Frank Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: true,
    isCameraOn: false,
  },
  {
    id: "4",
    name: "Hoang Van Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: false,
    isCameraOn: true,
  },
  {
    id: "5",
    name: "Steven Doe",
    avatar: "https://via.placeholder.com/150",
    isMicOn: true,
    isCameraOn: false,
  },
];
