"use client";

import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { ToolItem } from "./components";
import WebSearchIcon from "icons/WebSearchIcon";
import { FooterDetailAgent, TitleTab } from "../components";

export const Tools = () => {
  const t = useTranslations(NS_AI_AGENT);

  const handleUpdate = () => {
    console.log("Update");
  }

  return (
    <Stack flex={1} direction={"column"} spacing={3} padding={4}>
      <TitleTab title={t("tools.title")} description={t("tools.description")} />
      <ToolItem
        name={t("tools.webSearch")}
        description={t("tools.webSearchDescription")}
        icon={<WebSearchIcon />}
      />
      <FooterDetailAgent onClickUpdate={handleUpdate} />
    </Stack>
  );
};
