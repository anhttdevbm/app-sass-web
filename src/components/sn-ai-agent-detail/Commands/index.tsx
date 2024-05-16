"use client";

import PlusIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { ToolItem } from "../Tools/components";
import { TitleTab } from "../components";
import { CreateCommandModal } from "./components/CreateCommandModal";
import { useState } from "react";
import { ListCommand } from "./components/ListCommand";

const ListCommandExample = [
  {
    title: "Command 1",
    description: "Description 1",
    isWebSearch: true,
    isBackgroundTask: false,
    isUseKnowledge: true,
  },
  {
    title: "Command 2",
    description: "Description 2",
    isWebSearch: false,
    isBackgroundTask: true,
    isUseKnowledge: false,
  },
  {
    title: "Command 3",
    description: "Description 3",
    isWebSearch: true,
    isBackgroundTask: true,
    isUseKnowledge: true,
  },
];

export const Commands = () => {
  const t = useTranslations(NS_AI_AGENT);
  const [open, setOpen] = useState(false);

  const handleAddCommand = () => {
    setOpen(true);
  };

  return (
    <Stack flex={1} direction={"column"} spacing={3} padding={4}>
      <TitleTab
        title={t("commands.title")}
        description={t("commands.description")}
      />
      <ToolItem
        name={t("commands.addCommand")}
        icon={<PlusIcon color="primary" fontSize="small" />}
        onClick={handleAddCommand}
        sxText={{ color: "primary.main", fontSize: "13px", fontWeight: 600 }}
      />
      <ListCommand list={ListCommandExample} />
      <CreateCommandModal open={open} onClose={() => setOpen(false)} />
    </Stack>
  );
};
