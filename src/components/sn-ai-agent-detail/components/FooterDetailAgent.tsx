"use client"

import { Button } from "components/sn-ai-agent/components";
import { Stack } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";
import { getPath } from "utils/index";
import { AI_AGENT_PATH } from "constant/paths";
import { useRouter } from "next/navigation";
import { useAIAgent } from "store/aiAgent/selectors";

interface FooterDetailAgentProps {
  onUpdate?: () => void;
}

export const FooterDetailAgent: React.FC<FooterDetailAgentProps> = ({ onUpdate }) => {
  const aiAgentT = useTranslations(NS_AI_AGENT);
  const theme = useTheme();
  const router = useRouter();

  const {
    aiAgentFilters,
    page,
    limit,
  } = useAIAgent();

  const dataStringifyRef = useRef<string | undefined>();

  const onBackPrevPath = () => {
    const parsedQueries = dataStringifyRef.current
      ? JSON.parse(dataStringifyRef.current)
      : {};

    const prevPath = getPath(AI_AGENT_PATH, parsedQueries);

    router.push(prevPath);
  };

  const handleUpdate = () => {
    onUpdate && onUpdate();
    onBackPrevPath()
  }

  useEffect(() => {
    dataStringifyRef.current = JSON.stringify({
      ...aiAgentFilters,
      page,
      limit,
    });
  }, [aiAgentFilters, page, limit]);

  return (
    <Stack
    direction={"row"}
    justifyContent={"center"}
    alignItems={"center"}
    spacing={3}
    paddingTop={2}
    paddingBottom={2}
    borderTop={`1px solid ${theme.palette.grey[100]}`}
    >
      <Button type="outlined" text={aiAgentT("general.cancel")} onClick={onBackPrevPath} />
      <Button type="gradient" text={aiAgentT("general.update")} onClick={handleUpdate}/>
    </Stack>
  )
}