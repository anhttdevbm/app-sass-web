"use client";

import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { Header } from "./Header";
import { Body } from "./Body";

interface ChatAIProps {
  id: string;
}

export const ChatAI: React.FC<ChatAIProps> = ({ id }) => {
  const { aiAgent, onGetAgent } = useAIAgent();

  useEffect(() => {
    onGetAgent(id);
  }, [id]);

  return (
    <Stack>
      <Header
        id={aiAgent?.id as string}
        title={aiAgent?.name as string}
        avatar={aiAgent?.avatar}
      />
      <Body />
    </Stack>
  );
};
