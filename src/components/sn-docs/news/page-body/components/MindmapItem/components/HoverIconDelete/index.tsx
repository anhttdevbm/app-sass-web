import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box } from "@mui/material";

export default function HoverIconDelete({
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
      }}
      onClick={onClickIcon}
    >
      <RemoveCircleIcon sx={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
