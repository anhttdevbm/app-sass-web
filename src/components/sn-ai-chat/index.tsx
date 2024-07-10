"use client";

import { Box, useMediaQuery } from "@mui/material";
import ChattingRoomLayout from "components/sn-chatting-room/components/Layout";
import { useState } from "react";
import { BoxChat, Sidebar } from "./components";
import SwitchChatAI, { CHAT_AI_STEP } from "./components/SwitchChatAI";

const AIChat = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [currStep, setCurrStep] = useState(CHAT_AI_STEP.IDLE);

  const boxStyles = {
    width: "100%",
    height: "100%",
    ...(isMobile ? {} : { display: "flex", alignItems: "flex-start" }),
  };

  const renderContent = () => {
    if (isMobile) {
      return <SwitchChatAI currStep={currStep} setCurrStep={setCurrStep} />;
    } else {
      return (
        <ChattingRoomLayout>
          <Sidebar />
          <BoxChat />
        </ChattingRoomLayout>
      );
    }
  };

  return <Box sx={boxStyles}>{renderContent()}</Box>;
};

export default AIChat;
