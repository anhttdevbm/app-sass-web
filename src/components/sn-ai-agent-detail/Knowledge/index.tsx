"use client";

import { Stack } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { TitleTab } from "../components";
import { Switch } from "./components/Switch";
import { useState } from "react";
import { AddSource } from "./components";

export const Knowledge = () => {
  const t = useTranslations(NS_AI_AGENT);
  const [isSwitched, setIsSwitched] = useState(false);

  const handleSwitch = () => {
    setIsSwitched(!isSwitched);
  };

  return (
    <Stack direction={"column"} spacing={3} flex={1} padding={4}>
      <TitleTab
        title={t("knowledge.title")}
        description={t("knowledge.description")}
      />
      <Switch
        isSwitched={isSwitched}
        onClick={handleSwitch}
        name={t("knowledge.enableKnowledge")}
      />
      <AddSource />
    </Stack>
  );
};
