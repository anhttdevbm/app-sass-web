import { Theme } from "@mui/material";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import React, { FC, useRef, useState } from "react";
import { Dialog } from "../Dialog";
import { TextField } from "../TextField";
import { ListButtonSelect } from "./ListButtonSelect";
import { UploadAvatar } from "./UploadAvatar";
import { NS_AI_AGENT } from "constant/index";
import { Textarea } from "components/sn-ai-agent-detail/General/components";
import { useAIAgent } from "store/aiAgent/selectors";
import { AIAgent, CreateAIAgentPayload } from "store/aiAgent/types";

export const OUTLINE_COLOR = "rgba(54, 153, 255, 0.5)";

interface CreateModalProps {
  onClose: () => void;
  open: boolean;
  theme: Theme;
}

export const CreateAIAgentModal: FC<CreateModalProps> = ({
  onClose,
  open,
  theme
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("");

  const t = useTranslations(NS_AI_AGENT);

  const { onCreateAgent } = useAIAgent();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  }

  const handleOnChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setImage(null);
    setSelected(null);
    setDescription("");
    setName("");
    onClose();
  };

  const handleSubmit = () => {
    if (!description && !name) {
      return;
    }

    const agentData: CreateAIAgentPayload = {
      avatar: image,
      description,
      name,
    }
    onCreateAgent(agentData);

    handleClose();
  };

  return (
    <Dialog
      title={t("layout.header.createAgent")}
      submitText={t("layout.header.create")}
      onClose={handleClose}
      onSubmit={handleSubmit}
      open={open}
      sizeCloseIcon="medium"
      sx={{ width: "60vw" }}
    >
      <TextField
        fullWidth
        label={t("layout.header.agentName")}
        theme={theme}
        variant="filled"
        value={name}
        onChange={handleOnChangeTextField}
      />
      <UploadAvatar
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleUploadClick={handleUploadClick}
        image={image}
        label={t("layout.header.avatar")}
        titleButton={t("layout.header.upload")}
      />
      <Textarea
        label={t("general.description")}
        placeholder={t("general.placeholderTextarea")}
        value={description}
        onChange={handleOnChangeTextarea}
        containerStyle={{
          marginTop: "24px",
        }}
      />
      <ListButtonSelect
        selected={selected}
        setSelected={setSelected}
        theme={theme}
        label={t("layout.header.agentName")}
      />
    </Dialog>
  );
};
