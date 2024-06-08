import { Title } from "components/sn-ai-agent-detail/ChatAI/components/Title";
import { Stack } from "@mui/material";
import { CommandButton } from "components/sn-ai-agent-detail/ChatAI/components/CommandButton";
import { AddCommandButton } from "components/sn-ai-agent-detail/ChatAI/components/AddCommandButton";
import { useEffect, useState } from "react";
import { Command } from "store/aiAgent/types";
import { useAIAgent } from "store/aiAgent/selectors";

interface EmptyMessageProps {
  onClick: (prompt: string) => void;
}

export const EmptyMessage = ({ onClick }: EmptyMessageProps) => {
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

  return (
    <>
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
            onClick={() => onClick(item.prompt)}
          />
        ))}
        <AddCommandButton
          width={commands.length % 2 === 0 ? "100%" : "calc(50% - 8px)"}
        />
      </Stack>
    </>
  )
}
