import { Box, IconButton, Typography } from "@mui/material";
import ArrowDownIcon from "icons/ArrowDownIcon";

interface ChatDetailUserMenuItemMobileProps {
  text: string;
  icon: JSX.ElementType;
  stroke?: string;
  borderBottom?: boolean;
  handleOnClick?: () => void;
  onOpenDrawer?: () => void;
  isDrawerOpen?: boolean;
}

const GroupChatItemMobile: React.FC<ChatDetailUserMenuItemMobileProps> = (
  props,
) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "12px 24px",
        gap: "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "8px 0px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <props.icon
              sx={{
                width: "24px",
                height: "24px",
                fill: "none",
                filter: "opacity(0.8)",
              }}
              stroke={props.stroke}
            />
          </Box>
          <Typography variant="body2" color="var(--Black, #212121)">
            {props.text}
          </Typography>
        </Box>

        <IconButton
          onClick={props.handleOnClick}
          sx={{
            display: "flex",
            width: "20px",
            height: "20px",
            justifyContent: "center",
            alignItems: "center",
            transform: "rotate(180deg)",
            flexShrink: "0",
            color: "#BABCC6",
          }}
        >
          <ArrowDownIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GroupChatItemMobile;
