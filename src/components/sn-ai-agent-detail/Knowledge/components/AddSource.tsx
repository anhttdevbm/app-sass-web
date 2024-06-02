import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { Box, Stack } from "@mui/material";
import useTheme from "hooks/useTheme";
import styled from "styled-components";
import { PRIMARY_GRADIENT_COLOR } from "components/sn-ai-agent/components";
import { useState } from "react";
import { Text } from "components/shared";
import { ButtonOutlineGradient } from "./ButtonOutlineGradient";
import AddLinkIcon from "icons/AddLinkIcon";
import AddMediaIcon from "icons/AddMediaIcon";
import YoutubeIcon from "icons/YoutubeIcon";
import { AddLinkModal } from "./AddLinkModal";
import { DropZoneGradient } from "./DropZoneGradient";

export const AddSource = () => {
  const t = useTranslations(NS_AI_AGENT);
  const theme = useTheme();
  const [isDragActive, setIsDragActive] = useState(false);
  const [openAddYoutube, setOpenAddYoutube] = useState(false);
  const [openAddLink, setOpenAddLink] = useState(false);

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    // Process the files here
    const files = event.dataTransfer.files;
    console.log(files);
  };

  const handleAddFromMedia = () => {
    console.log("Add From Media");
  };

  const handleAddLink = () => {
    setOpenAddLink(true);
  };

  const handleAddYoutube = () => {
    setOpenAddYoutube(true);
  };

  const handleSubmitAddYoutube = () => {
    console.log("Add youtube");
  };

  const handleSubmitAddLink = () => {
    console.log("Add link");
  };

  return (
    <Stack direction={"column"} spacing={1}>
      <Text
        variant={"h5"}
        fontWeight={400}
        color={"grey.300"}
        textTransform={"uppercase"}
      >
        {t("knowledge.addSource")}
      </Text>
      <DropZoneGradient
        theme={theme}
        isDragActive={isDragActive}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        placeholder={t("knowledge.dragOrSelect")}
      />
      <Stack direction={"row"} spacing={1} width={"100%"}>
        <ButtonOutlineGradient
          name={t("knowledge.addFromMedia")}
          icon={<AddMediaIcon />}
          onClick={handleAddFromMedia}
        />
        <ButtonOutlineGradient
          name={t("knowledge.addLink")}
          icon={<AddLinkIcon />}
          onClick={handleAddLink}
        />
        <ButtonOutlineGradient
          name={t("knowledge.addYoutube")}
          icon={<YoutubeIcon />}
          onClick={handleAddYoutube}
        />
      </Stack>
      <AddLinkModal
        open={openAddYoutube}
        onClose={() => setOpenAddYoutube(false)}
        description={t("knowledge.addYoutubeDescription")}
        title={t("knowledge.addYoutube")}
        placeholder={t("knowledge.addYoutubePlaceholder")}
        icon={<YoutubeIcon />}
        onSubmit={handleSubmitAddYoutube}
      />
      <AddLinkModal
        open={openAddLink}
        onClose={() => {
          setOpenAddLink(false);
        }}
        description={t("knowledge.addLinkDescription")}
        title={t("knowledge.addLink")}
        placeholder={t("knowledge.addLinkPlaceholder")}
        icon={<AddLinkIcon />}
        onSubmit={handleSubmitAddLink}
      />
    </Stack>
  );
};
