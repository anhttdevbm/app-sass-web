import { Box, List, ListItem, ListItemButton, Theme } from "@mui/material";
import { Text } from "components/shared";
import useTheme from "hooks/useTheme";
import { FC, useRef, useState } from "react";
import { Button } from "../Button";
import { Dialog } from "../Dialog";
import { TextField } from "../TextField";
import { UploadAvatar } from "./UploadAvatar";
import { set } from "lodash";

export const OUTLINE_COLOR = "rgba(54, 153, 255, 0.5)";

interface CreateModalProps {
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
  theme: Theme;
}

export const CreateAIAgentModal: FC<CreateModalProps> = ({
  onClose,
  onSubmit,
  open,
}) => {
  const theme = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setImage(null);
    setSelected(null);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit();
    handleClose();
  };

  return (
    <Dialog
      title="Create agent"
      cancelText="Cancel"
      submitText="Create"
      onClose={handleClose}
      onSubmit={handleSubmit}
      open={open}
      sizeCloseIcon="medium"
      sx={{ width: "60vw" }}
    >
      <TextField fullWidth label="Agent name" theme={theme} variant="filled" />
      <UploadAvatar
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleUploadClick={handleUploadClick}
        image={image}
      />
      <Box
        padding={"8px 20px"}
        mt={3}
        border={`1px solid ${OUTLINE_COLOR}`}
        sx={{
          background: theme.palette.grey[50],
        }}
        height={"200px"}
      >
        <Text
          fontSize={"12px"}
          fontWeight={400}
          color={theme.palette.grey[300]}
          mb={1}
        >
          Agent name
        </Text>
        <List
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 0,
            gap: 2,
            overflow: "auto",
            maxHeight: "85%",
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <ListItem
              key={i}
              disablePadding
              sx={{
                width: "auto",
              }}
            >
              <ListItemButton
                onClick={() => setSelected(i)}
                selected={selected === i}
                sx={{
                  borderRadius: "20px",
                  border: `2px solid ${theme.palette.grey[100]}`,
                  color: theme.palette.text.primary,
                  fontSize: "14px",
                  fontWeight: 400,
                  "&:hover": {
                    outline: `none`,
                    border: `2px solid ${OUTLINE_COLOR}`,
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.light,
                    border: `2px solid ${OUTLINE_COLOR}`,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {`Agent name ${i + 1}`}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Dialog>
  );
};
