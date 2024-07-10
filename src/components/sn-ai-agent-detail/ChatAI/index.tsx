"use client";

import { Stack } from "@mui/material";
import { useAIAgent } from "store/aiAgent/selectors";
import { Header } from "./Header";
import { Body } from "./Body";
import { HEADER_HEIGHT } from "../../../layouts/Header";

export const ChatAI = () => {
  const { aiAgent, onGetAgent } = useAIAgent();

  return (
    <Stack height={`calc(100vh - ${HEADER_HEIGHT}px)`}>
      <Header
        id={aiAgent?.id as string}
        title={aiAgent?.name as string}
        avatar={aiAgent?.avatar}
      />
      <Body />
    </Stack>
  );
};
