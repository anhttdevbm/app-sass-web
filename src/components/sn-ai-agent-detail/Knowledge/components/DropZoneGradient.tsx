import { Theme } from "@mui/material";
import { Box } from "@mui/system";
import useTheme from "hooks/useTheme";
import { UploadFileFillIcon } from "icons/UploadFileFillIcon";

interface DropZoneGradientProps {
  theme: Theme;
  isDragActive: boolean;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  placeholder: string;
  onClick?: (event: React.DragEvent<HTMLDivElement>) => void;
}

export const DropZoneGradient = (props: DropZoneGradientProps) => {
  const theme = useTheme();

  return (
    <Box
      onDragOver={props.onDragOver}
      onDragLeave={props.onDragLeave}
      onDrop={props.onDrop}
      onClick={props.onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "192px",
        position: "relative",
        background:
          "linear-gradient(73.64deg, #0575E6 9%, #38E27B 80%, #38E27B 9%, #38E27B 80%)",
        borderRadius: "1em",
        border: "2px dashed",
        borderColor: theme.palette.background.paper,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "2px dashed",
          borderColor: "transparent",
          background: theme.palette.background.default,
          backgroundClip: "border-box",
          borderRadius: "1em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: theme.palette.primary.main,
        }}
      >
        <UploadFileFillIcon />
        {props.placeholder}
      </Box>
    </Box>
  );
};
