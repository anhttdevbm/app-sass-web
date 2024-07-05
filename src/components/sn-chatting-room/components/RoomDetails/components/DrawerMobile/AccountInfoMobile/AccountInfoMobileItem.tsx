import { Box, Typography } from "@mui/material";

interface ChatDetailInfoMenuItemProps {
  label: string;
  value: string;
}

const AccountInfoMobileItem: React.FC<ChatDetailInfoMenuItemProps> = (
  props,
) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingBottom: "16px",
        gap: "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "100px",
          flexShrink: "0",
        }}
      >
        <Typography variant="caption" color="#999999">
          {props.label}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexShrink: "0",
          flexGrow: "1",
        }}
      >
        <Typography variant="body2" color="#212121">
          {props.value}
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountInfoMobileItem;
