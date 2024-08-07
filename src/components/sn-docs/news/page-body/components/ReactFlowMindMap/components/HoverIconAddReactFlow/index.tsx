import { Box } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { useAppSelector } from "store/hooks";

export default function HoverIconAddReactFlow({
  onClickIcon,
}: {
  onClickIcon: () => void;
}) {
  const verMindMap = useAppSelector((state) => state.doc.mindMap.version);

  return (
    <Box
      sx={{
        width: "22px",
        height: "22px",
        color: "#14B9E5",
        cursor: "pointer",
        position: "absolute",
        right: verMindMap === "mindmap" ? 0 : undefined,
        zIndex: 100,
        backgroundColor: "primary.contrastText",
        bottom: verMindMap === "chart" ? "-45%" : undefined,
      }}
      onClick={onClickIcon}
    >
      {verMindMap === "mindmap" ? (
        <ArrowCircleRightIcon sx={{ width: "100%", height: "100%" }} />
      ) : (
        <ArrowCircleDownIcon sx={{ width: "100%", height: "100%" }} />
      )}
    </Box>
  );
}