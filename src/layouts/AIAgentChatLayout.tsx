import { Stack } from "@mui/material";
import { Endpoint } from "api";
import { NS_AI_AGENT, NS_COMMON, SCROLL_ID } from "constant/index";
import { AI_AGENT_GENERAL_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";
import React, { useEffect, useRef } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { useHeaderConfig } from "store/app/selectors";
import { getPath } from "utils/index";

type AIAgentDetailLayoutProps = {
  children: React.ReactNode;
  id: string;
};

const AIAgentChatLayout = ({ children, id }: AIAgentDetailLayoutProps) => {
  const { aiAgentFilters, aiAgent, onGetAgent, page, limit } = useAIAgent();
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const commonT = useTranslations(NS_COMMON);
  const aiAgentT = useTranslations(NS_AI_AGENT);

  const dataStringifyRef = useRef<string | undefined>();

  useEffect(() => {
    if (!id) return;
    onGetAgent(id);
  }, [id, onGetAgent]);

  useEffect(() => {
    dataStringifyRef.current = JSON.stringify({
      ...aiAgentFilters,
      page,
      limit,
    });
  }, [aiAgentFilters, page, limit]);

  useEffect(() => {
    const parsedQueries = dataStringifyRef.current
      ? JSON.parse(dataStringifyRef.current)
      : {};

    const prevPath = getPath(AI_AGENT_GENERAL_PATH, undefined, { id });

      onUpdateHeaderConfig({
        imageUrl: aiAgent?.avatar || ImgPlaceHolderAgent.src,
        title: aiAgent?.name,
        searchPlaceholder: commonT("searchBy", { name: aiAgentT("list.key") }),
        prevPath,
        endpoint: Endpoint.AI_AGENT,
        key: "name",
      });

    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [commonT, aiAgent?.name, onUpdateHeaderConfig, aiAgentT]);

  return (
    <Stack
      sx={{
        overflow: "hidden",
        padding: "0px !important",
      }}
      id={SCROLL_ID}
      overflow="auto"
    >
      {children}
    </Stack>
  );
};

export default AIAgentChatLayout;
