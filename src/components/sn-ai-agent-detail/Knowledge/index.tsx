"use client";

import { Stack } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { FooterDetailAgent, TitleTab } from "../components";
import { Switch } from "./components/Switch";
import { useEffect, useState } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { AddSource, TableKnowledge } from "components/sn-ai-agent-detail/Knowledge/components";

export const Knowledge = () => {
  const t = useTranslations(NS_AI_AGENT);
  const {aiAgent, onUpdateAgent, onGetSources, listKnowledge} = useAIAgent();

  const [isKnowledgeEnabled, setKnowledgeEnabled] = useState(false);

  const toggleKnowledge = () => {
    setKnowledgeEnabled(!isKnowledgeEnabled);
  };

  useEffect(() => {
    if (aiAgent) {
      onGetSources(aiAgent.id);
    }
  }, [aiAgent]);

  useEffect(() => {
    if (listKnowledge.length > 0) {
      setKnowledgeEnabled(true);
    }
  }, [listKnowledge]);

  return (
    <Stack direction={"column"} justifyContent={"space-between"} flex={1}>
      <Stack direction={"column"} spacing={3} padding={4} height={"100%"}>
        <TitleTab
          title={t("knowledge.title")}
          description={t("knowledge.description")}
        />
        <Switch
          isSwitched={isKnowledgeEnabled}
          onClick={toggleKnowledge}
          name={t("knowledge.enableKnowledge")}
        />
        {isKnowledgeEnabled && (
          <Stack spacing={3} height={"100%"}>
            <AddSource />
           <TableKnowledge />
          </Stack>
        )}
      </Stack>
      <FooterDetailAgent />
    </Stack>
  );
};
