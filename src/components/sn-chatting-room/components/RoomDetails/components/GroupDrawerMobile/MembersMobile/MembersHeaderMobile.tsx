import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import React from "react";
interface MembersHeaderMobileProps {
  onClose: () => void;
}
const MembersHeaderMobile: React.FC<MembersHeaderMobileProps> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "54px",
        padding: "0px 16px",
        width: "100%",
        gap: "24px",
        borderBottom: "1px solid #ECECF3",
      }}
    >
      <IconButton
        sx={{ width: "12px", height: "21px", color: "#999999" }}
        onClick={props.onClose}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <Typography variant="h5" color="var(--Black, #212121)">
        Members
      </Typography>
    </Box>
  );
};

export default MembersHeaderMobile;
