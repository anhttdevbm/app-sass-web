"use client";

import { SelectChangeEvent, Stack } from "@mui/material";
import { Text } from "components/shared";
import { FooterDetailAgent } from "components/sn-ai-agent-detail/components/FooterDetailAgent";
import { TextField } from "components/sn-ai-agent/components";
import { UploadAvatar } from "components/sn-ai-agent/components/CreateModal/UploadAvatar";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import { useLocale, useTranslations } from "next-intl";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";
import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { UpdateAIAgentPayload } from "store/aiAgent/types";
import { useChatWithAI } from "store/aiChat/selectors";
import { Textarea } from "./components";
import { Select } from "./components/Select";

export const General = () => {
  const theme = useTheme();
  const t = useTranslations(NS_AI_AGENT);
  const locale = useLocale();

  const {aiAgent, onUpdateAgent, onUploadFile} = useAIAgent();
  const { tone: toneList, onGetTone } = useChatWithAI();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [name, setName] = React.useState<string>(aiAgent?.name || "");
  const [description, setDescription] = React.useState<string>(aiAgent?.description || "");
  const [tone, setTone] = React.useState<string>("default");

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
      newAgentData.avatar = await onUploadFile(file);
      isChanged = true;
    }

    if (isChanged) {
      onUpdateAgent(aiAgent.id, newAgentData as UpdateAIAgentPayload);
    }
  }, [name, description, tone, image, aiAgent, onUpdateAgent]);

  const toneOptions = useMemo(
    () =>
      Array.isArray(toneList)
        ? toneList.map((item) => {
          return {
            label: item.name[locale],
            value: item.name["en"],
            icon: item.icon as ReactNode,
          };
        })
        : [],
    [toneList, locale],
  );

  useEffect(() => {
    onGetTone({});
  }, [onGetTone]);

  useEffect(() => {
      if (aiAgent) {
        if (aiAgent.avatar) {
          setImage(aiAgent.avatar);
        }
        setName(aiAgent.name);
        setDescription(aiAgent.description || "");
        setTone(aiAgent.tone || "default");
      }
  }, [aiAgent]);

  return (
   <>
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
     <FooterDetailAgent onUpdate={handleUpdateAgent} />
   </>
  );
};
