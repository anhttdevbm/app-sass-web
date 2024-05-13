import { Theme } from "@mui/material";
import useTheme from "hooks/useTheme";
import { FC, useRef, useState } from "react";
import { Dialog } from "../Dialog";
import { TextField } from "../TextField";
import { UploadAvatar } from "./UploadAvatar";
import { ListButtonSelect } from "./ListButtonSelect";

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
      <ListButtonSelect
        selected={selected}
        setSelected={setSelected}
        theme={theme}
      />
    </Dialog>
  );
};
