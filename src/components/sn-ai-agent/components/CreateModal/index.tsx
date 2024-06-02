import { Theme } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { FC, useEffect, useRef, useState } from "react";
import { Dialog } from "../Dialog";
import { TextField } from "../TextField";
import { ListTemplateSelect } from "./ListTemplateSelect";
import { UploadAvatar } from "./UploadAvatar";
import { NS_AI_AGENT } from "constant/index";
import { useAIAgent } from "store/aiAgent/selectors";
import { CreateAIAgentPayload } from "store/aiAgent/types";
import { usePromptTemplate } from "store/promptTemplate/selectors";
import { PromptTemplate } from "store/promptTemplate/types";
import { mapDynamicStateToTemplateArray } from "store/promptTemplate/helper";

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

  const blankTemplate: PromptTemplate = {
    id: "",
    name: "Blank agent",
    icon: "📄",
    description: "Personalize your agent...",
    category: "",
    created_time: "",
    updated_time: "",
  }

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate>(blankTemplate);
  const [description, setDescription] = useState<string>("");
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);

  const t = useTranslations(NS_AI_AGENT);

  const {onCreateAgent, onUploadAvatar} = useAIAgent();
  const {promptTemplates, onGetPromptTemplates, isFetchingPromptTemplates} = usePromptTemplate()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setFile(file);

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
    setSelectedPrompt(blankTemplate);
    // setDescription("");
    setName("");
    setFile(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!description && !name) {
      return;
    }

    const agentData: CreateAIAgentPayload = {
      name,
      description: selectedPrompt.description
    }

    if (file) {
      agentData.avatar = await onUploadAvatar(file);
    }

    onCreateAgent(agentData);

    handleClose();
  };

  useEffect(() => {
    onGetPromptTemplates();
  }, []);

  useEffect(() => {
    if (!isFetchingPromptTemplates && promptTemplates) {
      setTemplates(mapDynamicStateToTemplateArray(promptTemplates));
    }
  }, [promptTemplates, isFetchingPromptTemplates]);

  return (
    <Dialog
      title={t("layout.header.createAgent")}
      submitText={t("layout.header.create")}
      onClose={handleClose}
      onSubmit={handleSubmit}
      open={open}
      sizeCloseIcon="medium"
      sx={{ width: "60vw" }}
      contentProps={{
        sx: {
          '&::-webkit-scrollbar': {display: "none"}
        },
      }}
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
      {/*<Textarea*/}
      {/*  label={t("general.description")}*/}
      {/*  placeholder={t("general.placeholderTextarea")}*/}
      {/*  value={description}*/}
      {/*  onChange={handleOnChangeTextarea}*/}
      {/*  containerStyle={{*/}
      {/*    marginTop: "24px",*/}
      {/*  }}*/}
      {/*/>*/}
      <ListTemplateSelect
        selected={selectedPrompt}
        setSelected={setSelectedPrompt}
        theme={theme}
        label={t("layout.header.agentName")}
        templates={templates}
        blankTemplate={blankTemplate}
      />
    </Dialog>
  );
};
