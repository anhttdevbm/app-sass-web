"use client";

import { Stack } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FooterDetailAgent, TitleTab } from "../components";
import { AddSource, TableKnowledge } from "./components";
import { Switch } from "./components/Switch";

const ListKnowledge = [
  {
    agent: "Agent 1",
    status: "Active",
    type: "Type 1",
  },
  {
    agent: "Agent 2",
    status: "Inactive",
    type: "Type 2",
  },
  {
    agent: "Agent 3",
    status: "Active",
    type: "Type 3",
  },
  {
    agent: "Agent 4",
    status: "Inactive",
    type: "Type 4",
  },
  {
    agent: "Agent 5",
    status: "Active",
    type: "Type 5",
  },
  {
    agent: "Agent 6",
    status: "Inactive",
    type: "Type 6",
  },
  {
    agent: "Agent 7",
    status: "Active",
    type: "Type 7",
  },
  {
    agent: "Agent 8",
    status: "Inactive",
    type: "Type 8",
  },
  {
    agent: "Agent 9",
    status: "Active",
    type: "Type 9",
  },
  {
    agent: "Agent 10",
    status: "Inactive",
    type: "Type 10",
  },
  {
    agent: "Agent 11",
    status: "Active",
    type: "Type 11",
  },
  {
    agent: "Agent 12",
    status: "Inactive",
    type: "Type 12",
  },
  {
    agent: "Agent 13",
    status: "Active",
    type: "Type 13",
  },
  {
    agent: "Agent 14",
    status: "Inactive",
    type: "Type 14",
  },
  {
    agent: "Agent 15",
    status: "Active",
    type: "Type 15",
  },
  {
    agent: "Agent 16",
    status: "Inactive",
    type: "Type 16",
  },
  {
    agent: "Agent 17",
    status: "Active",
    type: "Type 17",
  },
  {
    agent: "Agent 18",
    status: "Inactive",
    type: "Type 18",
  },
  {
    agent: "Agent 19",
    status: "Active",
    type: "Type 19",
  },
];

export const Knowledge = () => {
  const t = useTranslations(NS_AI_AGENT);

  const [isKnowledgeEnabled, setKnowledgeEnabled] = useState(false);

  const toggleKnowledge = () => {
    setKnowledgeEnabled(!isKnowledgeEnabled);
  };

  const handleUpdate = () => {
    console.log("Update");
  }

  return (
    <Stack direction={"column"} spacing={3} flex={1} padding={4}>
      <TitleTab
        title={t("knowledge.title")}
        description={t("knowledge.description")}
      />
      <Switch
        isSwitched={isKnowledgeEnabled}
        onClick={toggleKnowledge}
        name={t("knowledge.enableKnowledge")}
      />
      {isKnowledgeEnabled && <KnowledgeContent />}
      <FooterDetailAgent onUpdate={handleUpdate} />
    </Stack>
  );
};

const KnowledgeContent = () => (
  <>
    <AddSource />
    {ListKnowledge.length > 0 && (
      <TableKnowledge ListKnowledge={ListKnowledge} />
    )}
  </>
);
