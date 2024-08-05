import { Box } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

export default function HoverIconAddRightLeftChart({
  onClickIcon,
  positionIcon,
}: {
  onClickIcon: () => void;
  positionIcon?: "right" | "left";
}) {
  return (
    <Box
      sx={{
        width: "22px",
        height: "22px",
        color: "#14B9E5",
        cursor: "pointer",
        position: "absolute",
        right: positionIcon === "right" ? "-8%" : undefined,
        left: positionIcon === "left" ? "-8%" : undefined,
        zIndex: 100,
        backgroundColor: "primary.contrastText",
      }}
      onClick={onClickIcon}
    >
      {positionIcon === "right" ? (
        <ArrowCircleRightIcon sx={{ width: "100%", height: "100%" }} />
      ) : (
        <ArrowCircleLeftIcon sx={{ width: "100%", height: "100%" }} />
      )}
    </Box>
  );
}
