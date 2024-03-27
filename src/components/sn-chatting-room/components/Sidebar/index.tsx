"use client";

import { Box } from "@mui/material";
import React, { FC } from "react";
import SearchBar from "./components/SearchBar";
import ChatList from "./components/ChatList";
import useGetScreenMode from "hooks/useGetScreenMode";
import { useFetchingChattingReturns } from "components/sn-chatting-room/hooks/useFetchingChatting";
import { useWSChat } from "store/chat/helpers";

const Sidebar: FC<useFetchingChattingReturns> = ({
 onFilterConversation,
}) => {
  useWSChat();
  const { mobileMode } = useGetScreenMode();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(var(--vh, 1vh) * 100)",
        boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.10)",
        bgcolor: "var(--mui-palette-grey-50)",
        ...(!mobileMode
          ? { minWidth: "300px", maxWidth: "300px" }
          : { width: "100%" }),
      }}
    >
      <SearchBar onFilterConversation={onFilterConversation} />
      <ChatList />
    </Box>
  );
};

export default Sidebar;
