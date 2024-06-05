"use client";

import PlusIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ToolItem } from "../Tools/components";
import { FooterDetailAgent, TitleTab } from "../components";
import { CreateCommandModal } from "./components/CreateCommandModal";
import { ListCommand } from "./components/ListCommand";
import { useAIAgent } from "store/aiAgent/selectors";
import { Command } from "store/aiAgent/types";

export const Commands = () => {
  const t = useTranslations(NS_AI_AGENT);

  const {listCommand, onGetCommands, aiAgent} = useAIAgent();

  const [open, setOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>(listCommand);

  const handleAddCommand = () => {
    setOpen(true);
  };

  const handleCloseCreateCommand = () => {
    setOpen(false);
  }

  useEffect(() => {
    if (aiAgent) {
      onGetCommands(aiAgent.id);
    }
  }, [aiAgent]);

  useEffect(() => {
    setCommands(listCommand);
  }, [listCommand]);

  return (
   <>
     <Stack flex={1} direction={"column"} spacing={3} padding={4} height={"100%"}>
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
       <ListCommand list={commands} />
       <CreateCommandModal open={open} onClose={handleCloseCreateCommand} agentId={aiAgent?.id as string} />
     </Stack>
     <FooterDetailAgent />
   </>
  );
};
