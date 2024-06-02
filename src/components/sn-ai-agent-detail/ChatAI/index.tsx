"use client";

import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { Header } from "./Header";
import { Body } from "./Body";

export const ChatAI = () => {
  const { aiAgent, onGetAgent } = useAIAgent();

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
