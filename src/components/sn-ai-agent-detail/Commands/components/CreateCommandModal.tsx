import { Stack } from "@mui/material";
import { Textarea } from "components/sn-ai-agent-detail/General/components";
import { TextField } from "components/sn-ai-agent/components";
import { Dialog } from "components/sn-ai-agent/components/Dialog";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ListSwitch } from "./ListToggle";
import BookIcon from "icons/BookIcon";
import TaskIcon from "icons/TaskIcon";
import WebSearchIcon from "icons/WebSearchIcon";
import { useAIAgent } from "store/aiAgent/selectors";

interface CreateCommandModalProps {
  open: boolean;
  onClose: () => void;
  agentId: string;
}

export const CreateCommandModal = ({
  open,
  onClose,
  agentId,
}: CreateCommandModalProps) => {
  const t = useTranslations(NS_AI_AGENT);
  const theme = useTheme();

  const {onCreateCommand} = useAIAgent();

  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [useKnowledge, setUseKnowledge] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [bgTask, setBgTask] = useState(false);

  const handleSubmit = () => {
    onCreateCommand({
      name: name,
      prompt,
      background_task: bgTask,
      web_search: webSearch,
      knowledge: useKnowledge,
      agentId: agentId,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrompt("");
    setUseKnowledge(false);
    setWebSearch(false);
    setBgTask(false);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleTextareChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSwitchBgTask = () => {
    setBgTask(!bgTask);
  };

  const handleSwitchWebSearch = () => {
    setWebSearch(!webSearch);
  };

  const handleSwitchUseKnowledge = () => {
    setUseKnowledge(!useKnowledge);
  };

  return (
    <Dialog
      title={t("commands.createCommand")}
      submitText={t("commands.create")}
      onClose={onClose}
      onSubmit={handleSubmit}
      open={open}
      sizeCloseIcon="medium"
      sx={{ width: "60vw", height: "100vh" }}
    >
      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t("commands.name")}
          theme={theme}
          variant="filled"
          value={name}
          onChange={handleNameChange}
        />
        <Textarea
          label={t("commands.prompt")}
          placeholder={t("commands.writeYourCommand")}
          value={prompt}
          onChange={handleTextareChange}
        />
        <ListSwitch
          title={t("commands.tools")}
          list={[
            {
              icon: <TaskIcon />,
              name: t("commands.backgroundTask"),
              onClick: handleSwitchBgTask,
              checked: bgTask,
            },
            {
              icon: <WebSearchIcon />,
              name: t("commands.webSearch"),
              onClick: handleSwitchWebSearch,
              checked: webSearch,
            },
          ]}
        />
        <ListSwitch
          title={t("commands.settings")}
          list={[
            {
              icon: <BookIcon />,
              name: t("commands.useKnowledge"),
              onClick: handleSwitchUseKnowledge,
              checked: useKnowledge,
            },
          ]}
        />
      </Stack>
    </Dialog>
  );
};
