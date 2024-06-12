import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { Stack } from "@mui/material";
import useTheme from "hooks/useTheme";
import { useRef, useState } from "react";
import { Text } from "components/shared";
import { ButtonOutlineGradient } from "./ButtonOutlineGradient";
import AddLinkIcon from "icons/AddLinkIcon";
import AddMediaIcon from "icons/AddMediaIcon";
import YoutubeIcon from "icons/YoutubeIcon";
import { AddLinkModal } from "./AddLinkModal";
import { DropZoneGradient } from "./DropZoneGradient";
import { useAIAgent } from "store/aiAgent/selectors";
import { TypeKnowledge } from "store/aiAgent/types";

const handleFileUpload = async (file, aiAgent, onUploadFile, onAddSource, type) => {
  if (file && aiAgent) {
    const objectId = await onUploadFile(file);
    onAddSource({
      name: objectId as string,
      type: type,
      agentId: aiAgent.id
    });
  }
}

export const AddSource = () => {
  const t = useTranslations(NS_AI_AGENT);
  const theme = useTheme();
  const {onAddSource, aiAgent, onUploadFile} = useAIAgent();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [isDragActive, setIsDragActive] = useState(false);
  const [openAddYoutube, setOpenAddYoutube] = useState(false);
  const [openAddLink, setOpenAddLink] = useState(false);
  const [link, setLink] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [errorLink, setErrorLink] = useState<boolean>(false);

  const onDragOver = (event:  React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files[0];
    await handleFileUpload(file, aiAgent, onUploadFile, onAddSource, TypeKnowledge.FILE);
  };

  const handleAddFromFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await handleFileUpload(file, aiAgent, onUploadFile, onAddSource, TypeKnowledge.FILE);
  }

  const handleMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await handleFileUpload(file, aiAgent, onUploadFile, onAddSource, TypeKnowledge.MEDIA);
  };

  const handleAddFromMedia = async () => {
    if (mediaInputRef.current) {
      mediaInputRef.current.click();
    }
  };

  const handleAddLink = () => {
    setOpenAddLink(true);
  };

  const handleAddYoutube = () => {
    setOpenAddYoutube(true);
  };

  const handleClose = (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLink("");
    setYoutube("");
    setOpen(false);
    setErrorLink(false);
  };

  const handleCloseAddLink = () => handleClose(setOpenAddLink)

  const handleCloseAddYoutube = () => handleClose(setOpenAddYoutube)

  const handleOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    setUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setUrl(event.target.value);
    setErrorLink(false);
  };

  const handleOnChangeLink = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleOnChange(event, setLink)
  }

  const handleOnChangeYoutube = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleOnChange(event, setYoutube)
  }

  const handleSubmit = (
    url: string,
    isValidUrl: (url: string) => boolean,
    type: TypeKnowledge,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (aiAgent && isValidUrl(url)) {
      onAddSource({
        name: url,
        type: type,
        agentId: aiAgent.id
      });
      setErrorLink(false);
      setYoutube("");
      setLink("");
      setOpen(false);
    } else {
      setErrorLink(true);
    }
  };

  const handleSubmitAddLink = () => {
    handleSubmit(link, isValidUrl, TypeKnowledge.LINK, setOpenAddLink);
  };

  const handleSubmitAddYoutube = () => {
    handleSubmit(youtube, isValidYoutubeUrl, TypeKnowledge.YOUTUBE, setOpenAddYoutube);
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
        onClick={handleAddFromFile}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={mediaInputRef}
        style={{ display: "none" }}
        onChange={handleMediaChange}
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
        onClose={handleCloseAddYoutube}
        description={t("knowledge.addYoutubeDescription")}
        title={t("knowledge.addYoutube")}
        placeholder={t("knowledge.addYoutubePlaceholder")}
        icon={<YoutubeIcon />}
        onSubmit={handleSubmitAddYoutube}
        value={youtube}
        onChange={handleOnChangeYoutube}
        errorLink={errorLink}
      />
      <AddLinkModal
        open={openAddLink}
        onClose={handleCloseAddLink}
        description={t("knowledge.addLinkDescription")}
        title={t("knowledge.addLink")}
        placeholder={t("knowledge.addLinkPlaceholder")}
        icon={<AddLinkIcon />}
        onSubmit={handleSubmitAddLink}
        value={link}
        onChange={handleOnChangeLink}
        errorLink={errorLink}
      />
    </Stack>
  );
};

export const isValidUrl = (url: string): boolean => {
  const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(url);
}

export const isValidYoutubeUrl = (url: string): boolean => {
  const pattern = new RegExp('^(https?\\:\\/\\/)?(www\\.youtube\\.com|)\\/.+$','i');
  return pattern.test(url);
}