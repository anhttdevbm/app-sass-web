import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface AccountInfoMobileProps {
  onClose: () => void;
  title?: string;
}

const AccountInfoMobileHeader: React.FC<AccountInfoMobileProps> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "54px",
        padding: "0px 16px",
        gap: "24px",
        borderBottom: "1px solid #ECECF3",
        flexShrink: "0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            transform: "rotate(0deg)",
          }}
        >
          <IconButton
            sx={{ width: "12px", height: "21px", color: "#999999" }}
            onClick={props.onClose}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
        <Typography
          variant="h5"
          color="var(--Black, #212121)"
          sx={{ width: "180px", textAlign: "center" }}
        >
          {props.title ? props.title : "Account infomation"}
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountInfoMobileHeader;
