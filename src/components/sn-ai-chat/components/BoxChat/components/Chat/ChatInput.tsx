import { Box, Divider, TextField } from "@mui/material";
import { IconButton } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import AttachFileIcon from "icons/AttachFileIcon";
import SendGradientIcon from "icons/SendGradientIcon";
import { useTranslations } from "next-intl";
import React, { memo, useEffect, useState } from "react";

const BLUE = "#3699FF";
const DARK_BLUE = "#0575E6";
const LIGHT_GRAY = "#E3E3E3";
const GREY = "#E7E7E7";

interface ChatInputProperties {
  isLoading: boolean;
  initialMessage?: string;
  files?: File[];
  onMessageSubmit: (message: string) => void;
  onFileChange?: (file: File[]) => void;
  onResizeEvent?: (num?: number) => void;
  wrapperInputStyles?: React.CSSProperties;
}

const ChatInput = ({
  isLoading,
  initialMessage = "",
  files,
  onMessageSubmit,
  onFileChange,
  onResizeEvent,
  wrapperInputStyles,
}: ChatInputProperties) => {
  const [message, setMessage] = useState(initialMessage);
  const [isFocused, setIsFocused] = useState(false);
  const t = useTranslations(NS_AI_CHAT);

  const handleFileInputChange = ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files) {
      onFileChange?.(Array.from(files));
    }
  };

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  const handleMessageSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onMessageSubmit(message);
    setMessage("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleMessageSubmit}
      sx={{
        width: "100%",
        bottom: "1rem",
        ...wrapperInputStyles,
      }}
    >
      <Box sx={containerStyles}>
        <TextField
          disabled={isLoading}
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleMessageSubmit(e);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t("boxChat.enterMessage")}
          multiline
          maxRows={4}
          fullWidth
          variant="standard"
          InputProps={{ disableUnderline: true }}
        />
        <IconButton sx={attachFileButtonStyles}>
          <AttachFileIcon />
          <input type="file" hidden onChange={handleFileInputChange} />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              my: 0,
              mx: 1,
              height: "24px",
              borderColor: isFocused ? BLUE : undefined,
            }}
          />
        </Box>
        <IconButton type="submit" disabled={isLoading} sx={sendButtonStyles}>
          <SendGradientIcon fill={isFocused ? DARK_BLUE : undefined} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default memo(ChatInput);

const containerStyles = {
  position: "relative",
  outline: `1px solid ${GREY}`,
  display: "flex",
  alignItems: "center",
  borderRadius: "4px",
  justifyContent: "space-between",
  padding: "15px 20px",
  "&:focus-within": {
    outline: `1px solid ${BLUE}`,
    "& $divider": {
      borderColor: `${BLUE}`,
    },
  },
};

const attachFileButtonStyles = {
  border: `1px solid ${LIGHT_GRAY}`,
  borderRadius: "50%",
  padding: "6px",
};

const sendButtonStyles = {
  padding: "6px",
};
