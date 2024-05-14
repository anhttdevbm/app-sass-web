"use client";

import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { ToolItem } from "./components";
import WebSearchIcon from "icons/WebSearchIcon";

export const Tools = () => {
  const t = useTranslations(NS_AI_AGENT);

  return (
    <Stack flex={1} direction={"column"} spacing={3} padding={4}>
      <Stack direction={"column"} spacing={1}>
        <Text variant={"h5"}>{t("tools.title")}</Text>
        <Text fontSize={"14px"} fontWeight={400} color={"grey.300"}>
          {t("tools.description")}
        </Text>
      </Stack>
      <ToolItem
        name={t("tools.webSearch")}
        description={t("tools.webSearchDescription")}
        icon={<WebSearchIcon />}
      />
    </Stack>
  );
};
