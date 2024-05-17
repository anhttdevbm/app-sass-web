"use client";

import { Stack } from "@mui/material";
import { SearchInput } from "components/sn-ai-agent/components";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";

export const PromptTemplates = () => {
  const t = useTranslations(NS_AI_AGENT);
  const theme = useTheme();

  return (
    <Stack direction={"column"}>
      <Stack padding={"16px 32px"} borderBottom={"1px solid #ECECF3"}>
        <SearchInput
          theme={theme}
          placeholder={t("promptTemplates.searchTemplate")}
        />
      </Stack>
      <Stack padding={"24px 32px"} direction={"row"}>
        <Sidebar
          listTemplates={[
            { id: "1", name: "Project Manager sdfsdfsd", quantity: 10 },
            { id: "2", name: "Template 2", quantity: 20 },
            { id: "3", name: "Template 3", quantity: 30 },
          ]}
        />
        <Content
          listContent={[
            {
              id: "1",
              title: "Content 1",
              description: "Description 1",
              isSelected: true,
            },
            {
              id: "2",
              title: "Content 2",
              description: "Description 2",
              isSelected: false,
            },
            {
              id: "3",
              title: "Content 3",
              description: "Description 3",
              isSelected: false,
            },
          ]}
        />
      </Stack>
    </Stack>
  );
};
