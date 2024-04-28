import { Box, Divider, TextField } from "@mui/material";
import { IconButton, Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import AttachFileIcon from "icons/AttachFileIcon";
import { FileFillIcon } from "icons/FileFillIcon";
import SendGradientIcon from "icons/SendGradientIcon";
import { UploadFileOutlineIcon } from "icons/UploadFileOutlineIcon";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, memo, useEffect, useState } from "react";
import { ImportFileModal } from "./ImportFileModal";
import { CloseOutlined } from "@mui/icons-material";

const BLUE = "#3699FF";
const DARK_BLUE = "#0575E6";
const LIGHT_GRAY = "#E3E3E3";
const GREY = "#E7E7E7";

interface ChatInputProperties {
  isLoading: boolean;
  initialMessage?: string;
  files?: File[];
  onMessageSubmit: (message: string) => void;
  onFileChange?: (files: File[]) => void;
  wrapperInputStyles?: React.CSSProperties;
}

const ChatInput = ({
  isLoading,
  initialMessage = "",
  files,
  onMessageSubmit,
  onFileChange,
  wrapperInputStyles,
}: ChatInputProperties) => {
  const [message, setMessage] = useState(initialMessage);
  const [isFocused, setIsFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations(NS_AI_CHAT);

  const handleRemoveFile = (indexToRemove: number) => {
    const newFiles = files?.filter((file, index) => index !== indexToRemove);
    onFileChange?.(newFiles);
  };
  const handleImportFile = () => {
    setIsModalOpen(true);
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
        {files && files.length > 0 && (
          <Box sx={fileContainerStyles}>
            <IconButton sx={uploadFileStyles} onClick={handleImportFile}>
              <UploadFileOutlineIcon />
            </IconButton>
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  width: "140px",
                  ...uploadFileStyles,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "50%",
                    background: "white",
                    padding: "6px 8px",
                  }}
                >
                  <FileFillIcon width={12} height={16} />
                </Box>
                <Text
                  sx={{
                    fontSize: "12px",
                    marginLeft: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "70px",
                  }}
                >
                  {file.name}
                </Text>
                <IconButton
                  onClick={() => handleRemoveFile(index)}
                  sx={{
                    position: "absolute",
                    top: "-23%",
                    right: "-7%",
                    padding: "8px",
                    background: "white",
                    borderRadius: "50%",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    color: "primary.main",
                    padding: "4px",
                  }}
                >
                  <CloseOutlined sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Box
          sx={{
            padding: files && files.length > 0 ? "10px 0" : "0",
            borderTop:
              files && files.length > 0 ? `1px solid ${LIGHT_GRAY}` : "none",
            ...inputChatStyles,
          }}
        >
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
          <IconButton
            variant="normal"
            sx={attachFileButtonStyles}
            onClick={handleImportFile}
          >
            <AttachFileIcon />
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

      <ImportFileModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileUpload={onFileChange}
      />
    </Box>
  );
};

export default memo(ChatInput);

const containerStyles = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "15px 20px",
  borderRadius: "4px",
  marginBottom: "10px",
  flexDirection: "column",
  outline: `1px solid ${GREY}`,
  "&:focus-within": {
    outline: `1px solid ${BLUE}`,
    "& $divider": {
      borderColor: `${BLUE}`,
    },
  },
};

const fileContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  marginBottom: "12px",
  gap: "12px",
};

const inputChatStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const uploadFileStyles = {
  position: "relative",
  backgroundColor: "#F7F7FD",
  padding: "0px 10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  height: "40px",
};

const attachFileButtonStyles = {
  border: `1px solid ${LIGHT_GRAY}`,
  borderRadius: "50%",
  padding: "6px",
};

const sendButtonStyles = {
  padding: "6px",
};
