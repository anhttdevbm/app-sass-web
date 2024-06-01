"use client"

import React, {
  useEffect,
  useMemo,
  useCallback,
  useState,
  SyntheticEvent,
} from "react";
import { Alert, SelectChangeEvent, Snackbar, Stack } from "@mui/material";
import { TextField } from "components/sn-ai-agent/components";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import { useLocale, useTranslations } from "next-intl";
import { Text } from "components/shared";
import { UploadAvatar } from "components/sn-ai-agent/components/CreateModal/UploadAvatar";
import { useAIAgent } from "store/aiAgent/selectors";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";
import { Textarea } from "./components";
import { Select } from "./components/Select";
import { useChatWithAI } from "store/aiChat/selectors";
import { UpdateAIAgentPayload } from "store/aiAgent/types";
import { FooterDetailAgent } from "components/sn-ai-agent-detail/components/FooterDetailAgent";

export const General = () => {
  const theme = useTheme();
  const t = useTranslations(NS_AI_AGENT);
  const locale = useLocale();

  const {aiAgent, onGetAvatarLink, onUpdateAgent, isUpdatingAgent, onUploadAvatar} = useAIAgent();
  const {tone: toneList, onGetTone} = useChatWithAI();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<string>(ImgPlaceHolderAgent.src);
  const [file, setFile] = React.useState<File | null>(null);
  const [name, setName] = React.useState<string>(aiAgent?.name || "");
  const [description, setDescription] = React.useState<string>(aiAgent?.description || "");
  const [tone, setTone] = React.useState<string>("default");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const getAvatarLink = useCallback(async () => {
    if (aiAgent?.avatar) {
      const avatarLink = await onGetAvatarLink(aiAgent.avatar);
      if (avatarLink) {
        setImage(avatarLink);
      }
    }
  }, [aiAgent?.avatar, onGetAvatarLink]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleOnChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleOnChangeDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleToneChange = useCallback((e: SelectChangeEvent<string>) => {
    setTone(e.target.value as string);
  }, []);

  const handleUpdateAgent = useCallback(async () => {
    if (!aiAgent) return;

    const newAgentData: Partial<UpdateAIAgentPayload> = {
      name,
      description,
    };

    let isChanged = Object.keys(newAgentData).some(
      (key) => JSON.stringify(newAgentData[key as keyof UpdateAIAgentPayload]) !== JSON.stringify(aiAgent[key as keyof UpdateAIAgentPayload])
    );

    if (tone !== "default") {
      newAgentData.tone = tone;
      isChanged = true;
    }

    if ((image !== ImgPlaceHolderAgent.src || image !== aiAgent.avatar) && file) {
      newAgentData.avatar = await onUploadAvatar(file);
      isChanged = true;
    }

    if (isChanged) {
      onUpdateAgent(aiAgent.id, newAgentData as UpdateAIAgentPayload);
    }

    setOpenSnackbar(true);
  }, [name, description, tone, image, aiAgent, onUpdateAgent]);

  const handleCloseSnackbar = (event?: Event | SyntheticEvent<Element, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const toneOptions = useMemo(
    () =>
      Array.isArray(toneList)
        ? toneList.map((item) => {
          return {
            label: item.name[locale],
            value: item.id,
            icon: item.icon,
          };
        })
        : [],
    [toneList, locale],
  );

  useEffect(() => {
    getAvatarLink();
  }, []);

  useEffect(() => {
    onGetTone({});
  }, [onGetTone]);

  useEffect(() => {
    if (aiAgent) {
      setName(aiAgent.name);
      setDescription(aiAgent.description || "");
      setTone(aiAgent.tone || "default");
    }
  }, [aiAgent]);

  return (
    <Stack flex={1} direction={"column"} spacing={3} padding={4}>
      <Text variant={"h5"}>{t("general.title")}</Text>
      <TextField
        fullWidth
        label={t("general.agentName")}
        theme={theme}
        variant="filled"
        value={name}
        onChange={handleOnChangeName}
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
        onChange={handleOnChangeDescription}
      />
      <Select
        label={t("general.tone")}
        value={tone}
        theme={theme}
        options={toneOptions}
        onChange={handleToneChange}
      />
      <FooterDetailAgent onClickUpdate={handleUpdateAgent} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {t("general.updatedSuccess")}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
