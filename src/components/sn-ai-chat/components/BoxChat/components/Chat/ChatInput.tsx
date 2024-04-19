import { Box, Divider, TextField } from "@mui/material";
import { IconButton } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import AttachFileIcon from "icons/AttachFileIcon";
import SendGradientIcon from "icons/SendGradientIcon";
import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";

interface ChatInputProps {
  isLoading: boolean;
  initialMessage?: string;
  files?: File[];
  onEnterMessage: (message: string) => void;
  onChangeFiles?: (file: File[]) => void;
  onResize?: (num?: number) => void;
  wrapperInputSx?: any;
}

const ChatInput = ({
  isLoading,
  initialMessage = "",
  files,
  onEnterMessage,
  onChangeFiles,
  onResize,
  wrapperInputSx,
}: ChatInputProps) => {
  const [message, setMessage] = useState(initialMessage);
  const [isFocused, setIsFocused] = useState(false);
  const t = useTranslations(NS_AI_CHAT);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onChangeFiles?.(Array.from(event.target.files));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onEnterMessage(message);
    setMessage("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        bottom: "1rem",
        ...(wrapperInputSx ? { ...wrapperInputSx } : {}),
      }}
    >
      <Box sx={container}>
        <TextField
          disabled={isLoading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
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
        <IconButton sx={attachFileBth}>
          <AttachFileIcon />
          <input type="file" hidden onChange={handleFileChange} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Divider orientation="vertical" flexItem sx={{ my: 0, mx: 1, height: '24px', borderColor: isFocused ? '#3699FF' : undefined }} />
        </Box>
        <IconButton type="submit" disabled={isLoading} sx={sendBtn}>
          <SendGradientIcon fill={isFocused ? "#0575E6" : undefined} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default memo(ChatInput);

const container = {
  position: "relative",
  outline: "1px solid #e7e7e7",
  display: "flex",
  alignItems: "center",
  borderRadius: "4px",
  justifyContent: "space-between",
  padding: "15px 20px",
  "&:focus-within": {
    outline: "1px solid #3699FF",
    "& $divider": {
      borderColor: "#3699FF",
    }
  }
};

const attachFileBth = {
  border: "1px solid #E3E3E3",
  borderRadius: "50%",
  padding: "6px"
};

const sendBtn = {
  padding: "6px"
};
