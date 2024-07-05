import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "../Sidebar";
import { BoxChat } from "../BoxChat";

export const CHAT_AI_STEP = {
  IDLE: "IDLE",
  SIDEBAR: "SIDEBAR",
  BOX_CHAT: "BOX_CHAT",
};

interface SwitchChatAIProps {
  currStep: string;
  setCurrStep: (step: string) => void;
}

const SwitchChatAI = ({ currStep, setCurrStep }: SwitchChatAIProps) => {
  useEffect(() => {
    setCurrStep(CHAT_AI_STEP.SIDEBAR);

    return () => {
      setCurrStep(CHAT_AI_STEP.IDLE);
    };
  }, []);

  const switchToBoxChat = () => {
    setCurrStep(CHAT_AI_STEP.BOX_CHAT);
  };

  const handleBackToSidebar = () => {
    setCurrStep(CHAT_AI_STEP.SIDEBAR);
  };

  const renderContent = useCallback(() => {
    switch (currStep) {
      case CHAT_AI_STEP.SIDEBAR:
        return <Sidebar popupMode={true} onSwitchToBoxChat={switchToBoxChat} />;
      case CHAT_AI_STEP.BOX_CHAT:
        return (
          <BoxChat popupMode={true} onBackToSidebar={handleBackToSidebar} />
        );
      default:
        return null;
    }
  }, [currStep]);

  return <>{renderContent()}</>;
};

export default SwitchChatAI;
