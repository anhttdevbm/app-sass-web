import { Alert, Snackbar, Stack } from "@mui/material";
import { IconButton, Text } from "components/shared";
import { CopyTextIcon } from "icons/CopyTextIcon";
import { SyntheticEvent, useState } from "react";

export interface TemplateProps {
  id: string;
  title: string;
  description: string;
}

export const formatText = (text: string) => {
  return text.split(/(\[.*?\])/).map((part, i) =>
    i % 2 === 0 ? part : <span key={i} style={{color: '#FF2D60'}}>{part}</span>
  );
};

export const Template = ({
  id,
  title,
  description,
}: TemplateProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(description);
    } else {
      const el = document.createElement("textarea");
      el.value = description;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setOpenSnackbar(true);
  }

  const handleCloseSnackbar = (event?: Event | SyntheticEvent<Element, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Stack
      padding={2}
      spacing={1}
      direction={"column"}
      bgcolor={"background.default"}
      width={"100%"}
      borderRadius={"4px"}
      position={"relative"}
      sx={{
        cursor: "pointer",
        "&:hover": {
          bgcolor: "primary.light",
          borderColor: "primary.main",
          "& .copy-icon": {
            visibility: "visible",
            backgroundColor: "primary.dark",
          },
        },
      }}
      border={"1px solid"}
      borderColor={"transparent"}
    >
      <Text variant={"h6"}>{title}</Text>
      <Text fontSize={"14px"} fontWeight={400} color={"grey.400"}>
        {formatText(description)}
      </Text>
      <IconButton
        className="copy-icon"
        onClick={handleCopy}
        sx={{
          position: "absolute",
          right: 16,
          top: 8,
          padding: 1,
          backgroundColor: "primary.main",
          borderRadius: "4px",
          visibility: "hidden",
        }}
      >
        <CopyTextIcon style={{color: "white"}} width={"16px"} height={"16px"} />
      </IconButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Stack>
  );
};
