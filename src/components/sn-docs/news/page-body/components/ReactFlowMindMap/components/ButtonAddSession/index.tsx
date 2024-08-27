import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ButtonAddSession({
  onAddSession,
}: {
  onAddSession: () => void;
}) {
  return (
    <Box
      minHeight="48px"
      display="flex"
      alignItems="center"
      sx={{
        cursor: "pointer",
        position: "absolute",
        bottom: "-90%",
      }}
    >
      <Button
        sx={{
          display: "flex",
          width: "124px",
          backgroundColor: "#14B9E5",
          color: "white",
          borderRadius: "100px",
          textTransform: "none",
          paddingY: 1,
          paddingX: 1,
          "&:hover": {
            backgroundColor: "#008ba3",
          },
          gap: 0.5,
        }}
        onClick={onAddSession}
      >
        <AddIcon width="10px" height="10px" />
        <Typography fontSize="13px">Add Session</Typography>
      </Button>
    </Box>
  );
}
