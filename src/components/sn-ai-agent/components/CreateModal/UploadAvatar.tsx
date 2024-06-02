import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Box, IconButton } from "@mui/material";
import { Button } from "../Button";
import { Text } from "components/shared";

interface UploadAvatarProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadClick: () => void;
  image: string | null;
  label?: string;
  titleButton?: string;
}

export const UploadAvatar: React.FC<UploadAvatarProps> = ({
  fileInputRef,
  handleFileChange,
  handleUploadClick,
  image,
  label,
  titleButton,
}) => {
  return (
    <Box
      marginTop={3}
      padding="0 20px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={1}
    >
      <Text fontSize={"12px"} fontWeight={400} color={"grey.300"}>
        {label}
      </Text>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
        gap={2}
      >
        <label>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <IconButton
            sx={{
              backgroundColor: "info.light",
              padding: "20px",
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "64px",
              height: "64px",
            }}
            onClick={handleUploadClick}
          >
            {!image && <PhotoCameraIcon />}
          </IconButton>
        </label>
        <Button
          type="upload"
          text={titleButton || "Upload"}
          onClick={handleUploadClick}
          icon={IosShareRoundedIcon}
        />
      </Box>
    </Box>
  );
};
