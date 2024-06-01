import { Stack } from "@mui/material";
import { Endpoint } from "api";
import Wrapper from "components/Wrapper";
import TabList from "components/sn-ai-agent-detail/components/TabList";
import { NS_AI_AGENT, NS_COMMON, SCROLL_ID } from "constant/index";
import { AI_AGENT_PATH } from "constant/paths";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useRef } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { useHeaderConfig } from "store/app/selectors";
import { getPath } from "utils/index";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";
import { Button } from "components/sn-ai-agent/components";

type AIAgentDetailLayoutProps = {
  children: React.ReactNode;
  id: string;
};

const AIAgentDetailLayout = ({ children, id }: AIAgentDetailLayoutProps) => {
  const { aiAgentFilters, aiAgent, onGetAgent, page, limit, onGetAvatarLink } = useAIAgent();
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const { isDarkMode } = useTheme();
  const commonT = useTranslations(NS_COMMON);
  const aiAgentT = useTranslations(NS_AI_AGENT);
  const { isLgBigger } = useBreakpoint();
  const theme = useTheme();

  const dataStringifyRef = useRef<string | undefined>();

  const fetchAvatarLink =  async () => {
    if (!aiAgent?.avatar) return ImgPlaceHolderAgent.src;
    try {
      return onGetAvatarLink(aiAgent?.avatar);
    } catch (error) {
      console.error(error);
    }
  };

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

    const prevPath = getPath(AI_AGENT_PATH, parsedQueries);

    (async () => {
      const imageUrl = await fetchAvatarLink();

      onUpdateHeaderConfig({
        imageUrl: imageUrl,
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
  }, [commonT, aiAgent?.name, onUpdateHeaderConfig, aiAgentT]);

  return (
    <Wrapper
      sx={{
        overflow: "hidden",
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
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={3}
        paddingTop={2}
        paddingBottom={2}
        borderTop={`1px solid ${theme.palette.grey[100]}`}
      >
        <Button type="outlined" text={aiAgentT("general.cancel")} />
        <Button type="gradient" text={aiAgentT("general.update")} />
      </Stack>
    </Wrapper>
  );
};

export default AIAgentDetailLayout;
