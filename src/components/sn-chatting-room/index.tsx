"use client";

import React, { useEffect, useState } from "react";
import { SNChat } from "./components";
import useGetScreenMode from "hooks/useGetScreenMode";
import { Box, Typography } from "@mui/material";
import useFetchingChatting from "./hooks/useFetchingChatting";
import ChattingRoomMobileLayout from "./components/Layout/ChattingRoomMobileLayout";
import AddGroup from "components/sn-chat/chatGroup/AddGroup";
import { useChat } from "store/chat/selectors";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import useModalChatting from "./hooks/useModalChatting";

const { RoomDetails, Sidebar, ChattingRoomLayout } = SNChat;

const ChattingRoom = () => {
  const [openAddGroup, setOpenAddGroup] = useState(false);

  const { mobileMode } = useGetScreenMode();
  const { onFilterConversation, onChangeParamsConversation } =
    useFetchingChatting();
  const {
    conversationInfo: currentConversation,
    dataTransfer,
    onSetChatDesktop,
  } = useChat();
  const contentModalChatting = useModalChatting();

  useEffect(() => {
    onSetChatDesktop(true);
  }, [onSetChatDesktop]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        ...(!mobileMode && { display: "flex", alignItems: "flex-start" }),
      }}
    >
      {!mobileMode ? (
        <ChattingRoomLayout>
          <Sidebar
            onFilterConversation={onFilterConversation}
            onChangeParamsConversation={onChangeParamsConversation}
          />
          {Object.keys(dataTransfer).length !== 0 ? (
            <RoomDetails />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="94vh"
            >
              <Typography variant="h3">Please select a conversation</Typography>
            </Box>
          )}
        </ChattingRoomLayout>
      ) : (
        <>
          {currentConversation ? (
            <RoomDetails />
          ) : (
            <ChattingRoomMobileLayout setOpenAddGroup={setOpenAddGroup}>
              {openAddGroup ? (
                <AddGroup />
              ) : (
                <Sidebar
                  onFilterConversation={onFilterConversation}
                  onChangeParamsConversation={onChangeParamsConversation}
                />
              )}
            </ChattingRoomMobileLayout>
          )}
        </>
      )}
      <DefaultPopupLayout {...contentModalChatting} />
    </Box>
  );
};

export default ChattingRoom;
