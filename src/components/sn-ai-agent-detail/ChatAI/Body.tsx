import { Stack } from "@mui/material";
import { Title } from "./components/Title";
import { AddCommandButton } from "./components/AddCommandButton";
import { Textarea } from "../General/components";
import { useTranslations } from "next-intl";
import { NS_AI_AGENT } from "constant/index";
import { CommandButton } from "./components/CommandButton";
import { useAIAgent } from "store/aiAgent/selectors";
import { useEffect, useState } from "react";
import { Command } from "store/aiAgent/types";

export const Body = () => {
  const t = useTranslations(NS_AI_AGENT);

  const [commands, setCommands] = useState<Command[]>([]);
  const {listCommand, onGetCommands, aiAgent} = useAIAgent();

  useEffect(() => {
    if (aiAgent) {
      onGetCommands(aiAgent.id);
    }
  }, [aiAgent]);

  useEffect(() => {
    if (listCommand.length > 4) {
      setCommands(listCommand.slice(0, 4));
    } else {
      setCommands(listCommand);
    }
  }, [listCommand]);

  const handleSendMsg = () => {
    console.log("Send Message");
  };

  const handleClickCommand = () => {
    console.log("Click Command");
  };

  return (
    <Stack
      padding={3}
      alignItems={"center"}
      justifyContent={"space-between"}
      spacing={3}
      width={"100%"}
    >
      <Title />
      <Stack
        gap={2}
        direction="row"
        flexWrap="wrap"
        width={commands.length === 0 ? "296px" : "100%"}
      >
        {commands.map((item) => (
          <CommandButton
            key={item.id}
            icon={<></>}
            label={item.name}
            description={item.prompt}
            onClick={handleClickCommand}
          />
        ))}
        <AddCommandButton
          width={commands.length % 2 === 0 ? "100%" : "calc(50% - 8px)"}
        />
      </Stack>
      <Textarea
        placeholder={t("chatAIAgent.askMeAnything")}
        isCount={false}
        onSend={handleSendMsg}
      />
    </Stack>
  );
};
