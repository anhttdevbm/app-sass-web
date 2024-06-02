"use client"

import { Stack } from "@mui/material";
import { Endpoint } from "api";
import Wrapper from "components/Wrapper";
import TabList from "components/sn-ai-agent-detail/components/TabList";
import { NS_AI_AGENT, NS_COMMON, SCROLL_ID } from "constant/index";
import { AI_AGENT_PATH } from "constant/paths";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, ComponentProps } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { useHeaderConfig } from "store/app/selectors";
import { getPath } from "utils/index";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";
import { HEADER_HEIGHT } from "./Header";
import WrapperAIAgentDetail from "components/sn-ai-agent-detail/Wrapper";

type AIAgentDetailLayoutProps = {
  children: React.ReactNode;
  id: string;
};

const AIAgentDetailLayout = ({ children, id }: AIAgentDetailLayoutProps) => {
  const { aiAgentFilters, aiAgent, onGetAgent, page, limit } = useAIAgent();
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const { isDarkMode } = useTheme();
  const commonT = useTranslations(NS_COMMON);
  const aiAgentT = useTranslations(NS_AI_AGENT);
  const { isLgBigger } = useBreakpoint();

  const dataStringifyRef = useRef<string | undefined>();


  useEffect(() => {
    if (!id) return
    onGetAgent(id);
  }, [id]);

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

    const prevPath = getPath(AI_AGENT_PATH, parsedQueries);

    (async () => {
      onUpdateHeaderConfig({
        imageUrl: aiAgent?.avatar || ImgPlaceHolderAgent.src,
        title: aiAgent?.name,
        searchPlaceholder: commonT("searchBy", { name: aiAgentT("list.key") }),
        prevPath,
        endpoint: Endpoint.AI_AGENT,
        key: "name",
      });
    })();

    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [aiAgent]);

  return (
    <WrapperAIAgentDetail
      sx={{
        padding: `${isLgBigger ? "24" : "16"}px!important`,
        paddingTop: "0px!important",
      }}
      id={SCROLL_ID}
      overflow="auto"
    >
      <Stack
        position="relative"
        zIndex={12}
        bgcolor={isDarkMode ? "background.default" : "background.paper"}
        direction={"column"}
        justifyContent={"space-between"}
      >
        <TabList />
      </Stack>
      {children}
    </WrapperAIAgentDetail>
  );
};

export default AIAgentDetailLayout;
