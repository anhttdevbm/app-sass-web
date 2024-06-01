"use client"

import React, { useEffect, useMemo, useCallback } from "react";
import { SelectChangeEvent, Stack } from "@mui/material";
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

export const General = () => {
  const theme = useTheme();
  const t = useTranslations(NS_AI_AGENT);
  const locale = useLocale();

  const {aiAgent, onGetAvatarLink} = useAIAgent();
  const {tone: toneList, onGetTone} = useChatWithAI();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<string>(ImgPlaceHolderAgent.src);
  const [name, setName] = React.useState<string>(aiAgent?.name || "");
  const [description, setDescription] = React.useState<string>(aiAgent?.description || "");
  const [tone, setTone] = React.useState<string>("default");

  const getAvatarLink = useCallback(async () => {
    if (aiAgent?.avatar) {
      const avatarLink = await onGetAvatarLink(aiAgent.avatar);
      if (avatarLink) {
        setImage(avatarLink);
      } else {
        setImage(ImgPlaceHolderAgent.src);
      }
    }
  }, [aiAgent?.avatar, onGetAvatarLink]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
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
  }, [getAvatarLink]);

  useEffect(() => {
    onGetTone({});
  }, [onGetTone]);

  useEffect(() => {
    if (aiAgent) {
      setName(aiAgent.name);
      setDescription(aiAgent.description || "");
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
    </Stack>
  );
};
