import { Box, Typography, Avatar } from "@mui/material";
import AvatarBadgeIcon from "icons/AvatarBadgeIcon";

const SearchDetailUserChatItem = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // width: "343px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "298.5px",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0,
            height: "48px",
            width: "48px",
          }}
        >
          <Avatar
            src={props?.avatar}
            sx={{
              borderRadius: "9999px",
              flex: "1 0 0",
              alignItems: "stretch",
            }}
          />
          <AvatarBadgeIcon
            sx={{
              width: "16px",
              height: "16px",
              position: "absolute",
              right: "-2px",
              bottom: "-2px",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Typography variant="h6" sx={{ width: "200px", color: "#212121" }}>
            {props?.name}
          </Typography>
          <Typography variant="body2" sx={{ width: "200px", color: "#828282" }}>
            You: Have good day!
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: "#999" }}>
        1h{" "}
      </Typography>
    </Box>
  );
};

export default SearchDetailUserChatItem;
