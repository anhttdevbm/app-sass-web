"use client";

import { Box } from "@mui/material";
import ChattingRoomLayout from "components/sn-chatting-room/components/Layout";
import useModalChatting from "components/sn-chatting-room/hooks/useModalChatting";
import useGetScreenMode from "hooks/useGetScreenMode";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useEffect } from "react";
import { useChat } from "store/chat/selectors";
import BoxChat from "./components/BoxChat";
import Sidebar from "./components/Sidebar";

const AIChat = () => {
  const { mobileMode } = useGetScreenMode();

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
          <Sidebar />
          <BoxChat />
        </ChattingRoomLayout>
      ) : (
        <>
          <Box></Box>
        </>
      )}
      <DefaultPopupLayout {...contentModalChatting} />
    </Box>
  );
};

export default AIChat;
