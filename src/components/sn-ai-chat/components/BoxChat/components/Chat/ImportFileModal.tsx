import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import { UploadFileFillIcon } from "icons/UploadFileFillIcon";
import { useTranslations } from "next-intl";
import React from "react";

interface ImportFileModalProps {
  open: boolean;
  onClose: () => void;
  onFileUpload?: (files: File[]) => void;
}

export const ImportFileModal: React.FC<ImportFileModalProps> = ({
  open,
  onClose,
  onFileUpload,
}) => {
  const theme = useTheme();
  const t = useTranslations(NS_AI_CHAT);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && onFileUpload) {
      onFileUpload(Array.from(event.target.files));
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onFileUpload) {
      onFileUpload(Array.from(e.dataTransfer.files));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        padding={24}
        borderBottom={`1px solid ${theme.palette.divider}`}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDirection={"row"}
      >
        <Text variant="h5">{t("boxChat.uploadFile")}</Text>
        <IconButton onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Box
        component="label"
        sx={{
          padding: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `2px dashed ${theme.palette.primary.main}`,
          m: 3,
          backgroundColor: "#F7F7FD",
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*, application/pdf"
          onChange={handleFileChange}
          hidden
          multiple
        />
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <UploadFileFillIcon />
          <Text fontSize={14} fontWeight={400} sx={{ color: "#3699FF" }}>
            {" "}
            {t("boxChat.dragOrSelectFile")}
          </Text>
        </Box>
      </Box>
    </Dialog>
  );
};
