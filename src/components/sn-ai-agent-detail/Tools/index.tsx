"use client";

import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { ToolItem } from "./components";
import WebSearchIcon from "icons/WebSearchIcon";
import { FooterDetailAgent, TitleTab } from "../components";
import { useRouter } from "next/navigation";
import { useAIAgent } from "store/aiAgent/selectors";
import { getPath } from "utils/index";
import { AI_AGENT_COMMANDS_PATH } from "constant/paths";

export const Tools = () => {
  const t = useTranslations(NS_AI_AGENT);
  const { push } = useRouter();
  const { aiAgent } = useAIAgent();

  const handleWebSearch = () => {
    const path = getPath(AI_AGENT_COMMANDS_PATH, undefined, {id: aiAgent?.id as string});
    push(path);
  }

  return (
   <>
     <Stack flex={1} direction={"column"} spacing={3} padding={4} height={"100%"}>
       <TitleTab title={t("tools.title")} description={t("tools.description")} />
       <ToolItem
         onClick={handleWebSearch}
         name={t("tools.webSearch")}
         description={t("tools.webSearchDescription")}
         icon={<WebSearchIcon />}
       />
     </Stack>
     <FooterDetailAgent />
   </>
  );
};
