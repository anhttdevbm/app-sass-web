import { Box } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

export default function HoverIconAddReactFlow({
  onClickIcon,
}: {
  onClickIcon: () => void;
}) {
  return (
    <Box
      sx={{
        width: "22px",
        height: "22px",
        color: "#14B9E5",
        cursor: "pointer",
        position: "absolute",
        right: 0,
        zIndex: 100,
        backgroundColor: "primary.contrastText"
      }}
      onClick={onClickIcon}
    >
      <ArrowCircleRightIcon sx={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
