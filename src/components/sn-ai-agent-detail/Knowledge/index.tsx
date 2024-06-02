"use client";

import { Stack } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { FooterDetailAgent, TitleTab } from "../components";
import { Switch } from "./components/Switch";
import { useEffect, useState } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { AddSource, TableKnowledge } from "components/sn-ai-agent-detail/Knowledge/components";
import styled from "styled-components";
import { PRIMARY_GRADIENT_COLOR } from "components/sn-ai-agent/components";

export const Knowledge = () => {
  const t = useTranslations(NS_AI_AGENT);
  const {aiAgent, onUpdateAgent} = useAIAgent();

  const [isKnowledgeEnabled, setKnowledgeEnabled] = useState(false);

  const toggleKnowledge = () => {
    setKnowledgeEnabled(!isKnowledgeEnabled);
  };

  const handleUpdate = () => {
    if (aiAgent) {
      onUpdateAgent(aiAgent.id, {enableKnowledge: isKnowledgeEnabled});
    }
  }

  useEffect(() => {
    if (aiAgent) {
      setKnowledgeEnabled(aiAgent.enableKnowledge);
    }
  }, [aiAgent]);

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
      <FooterDetailAgent onUpdate={handleUpdate} />
    </Stack>
  );
};
