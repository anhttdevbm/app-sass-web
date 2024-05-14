"use client";

import React from "react";
import { MenuItem, Stack } from "@mui/material";
import { Button, TextField } from "components/sn-ai-agent/components";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { Text } from "components/shared";
import { UploadAvatar } from "components/sn-ai-agent/components/CreateModal/UploadAvatar";
import { useAIAgent } from "store/aiAgent/selectors";
import ImgPlaceHolderAgent from "public/images/img-placeholder-agent.svg";
import { Textarea } from "./components";
import { Select } from "./components/Select";

export const General = () => {
  const theme = useTheme();
  const { aiAgent } = useAIAgent();
  const t = useTranslations(NS_AI_AGENT);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<string>(
    aiAgent?.avatar || ImgPlaceHolderAgent,
  );
  const [selectedTone, setSelectedTone] = React.useState<string>("default");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Stack flex={1} direction={"column"} spacing={3} padding={4}>
      <Text variant={"h5"}>{t("general.title")}</Text>
      <TextField
        fullWidth
        label={t("general.agentName")}
        theme={theme}
        variant="filled"
        value={aiAgent?.name}
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
        value={aiAgent?.description}
      />
      <Select
        label={t("general.tone")}
        value={selectedTone}
        theme={theme}
        onChange={(e) => setSelectedTone(e.target.value)}
      >
        <MenuItem disabled value={"default"}>
          <em>{t("general.default")}</em>
        </MenuItem>
        <MenuItem value={"test"}>test</MenuItem>
        <MenuItem value={"casual"}>casual</MenuItem>
      </Select>
    </Stack>
  );
};
