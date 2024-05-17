"use client";

import { Stack } from "@mui/material";
import Link from "components/Link";
import { Text } from "components/shared";
import { Button } from "components/sn-ai-agent/components";
import { NS_AI_AGENT } from "constant/index";
import {
  AI_AGENT_CHAT,
  AI_AGENT_COMMANDS_PATH,
  AI_AGENT_GENERAL_PATH,
  AI_AGENT_KNOWLEDGE_PATH,
  AI_AGENT_PROMPT_TEMPLATES_PATH,
  AI_AGENT_TOOLS_PATH,
} from "constant/paths";
import useTheme from "hooks/useTheme";
import AITabIcon from "icons/AITabIcon";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { useParams } from "next/navigation";
import { memo, useMemo } from "react";
import { getPath } from "utils/index";
import { useRouter } from "next/navigation";

interface Params {
  [key: string]: string | string[];
}

type TabItemProps = {
  href: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aiAgentT?: any;
  params: Params;
};

type TabActionsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aiAgentT?: any;
  params: Params;
};

const TabList = () => {
  const aiAgentT = useTranslations(NS_AI_AGENT);

  const params = useParams();

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        borderBottom={{ md: "1px solid" }}
        justifyContent="space-between"
        borderColor={{ md: "grey.100" }}
        width="100%"
        overflow="auto"
        bgcolor="background.paper"
      >
        <Stack direction="row" alignItems="center">
          {TABS.map((tab) => (
            <TabItem
              key={tab.label}
              {...tab}
              aiAgentT={aiAgentT}
              params={params}
            />
          ))}
        </Stack>
        <TabActions aiAgentT={aiAgentT} params={params} />
      </Stack>
    </>
  );
};

export default memo(TabList);

const TabItem = (props: TabItemProps) => {
  const { href, label, aiAgentT, params } = props;

  const { isDarkMode } = useTheme();

  const pathname = usePathname();

  const isActiveLink = useMemo(() => {
    const suffixPath = getSuffixPath(pathname);
    const suffixHref = getSuffixPath(href);
    return suffixPath === suffixHref;
  }, [href, pathname]);

  return (
    <Link
      href={getPath(href, undefined, { id: params.id as string })}
      underline="none"
      sx={{
        minWidth: 120,
        bgcolor: isActiveLink
          ? isDarkMode
            ? "grey.50"
            : "primary.light"
          : "transparent",
        "&:hover": {
          bgcolor: isDarkMode ? "grey.50" : "grey.100",
        },
        py: { xs: "20px", sm: "20px" },
        px: { xs: 2, sm: 3.5 },
        borderRadius: 1,
      }}
    >
      <Text
        variant="body2"
        color={isActiveLink ? "text.primary" : "grey.300"}
        fontWeight={600}
        whiteSpace="nowrap"
      >
        {aiAgentT(label)}
      </Text>
    </Link>
  );
};

const TabActions = (props: TabActionsProps) => {
  const { aiAgentT, params } = props;
  const router = useRouter();

  const handleRefToChat = () => {
    router.push(
      getPath(AI_AGENT_CHAT, undefined, {
        id: params.id as string,
      }),
    );
  };

  return (
    <Stack direction="row" alignItems="center" spacing={3} px={3} {...props}>
      <Button
        type="gradient"
        text={aiAgentT("tabList.chat")}
        icon={AITabIcon}
        onClick={handleRefToChat}
      />
    </Stack>
  );
};

const TABS = [
  { label: "tabList.general", href: AI_AGENT_GENERAL_PATH },
  { label: "tabList.tools", href: AI_AGENT_TOOLS_PATH },
  { label: "tabList.knowledge", href: AI_AGENT_KNOWLEDGE_PATH },
  { label: "tabList.commands", href: AI_AGENT_COMMANDS_PATH },
  { label: "tabList.promptTemplates", href: AI_AGENT_PROMPT_TEMPLATES_PATH },
];

const getSuffixPath = (path: string) => {
  const arrSplit = path.split("/");

  return arrSplit[3];
};
