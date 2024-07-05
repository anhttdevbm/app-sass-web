import { Box, ButtonBase, Typography } from "@mui/material";

const SelectBox = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        right: "0",
        bottom: "-66px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "8px",
        padding: "8px",
        borderRadius: "4px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px 0px rgba(33, 33, 33, 0.04)",
      }}
    >
      <Box>
        <Typography variant="body2" color={"#666"}>
          Add as admin
        </Typography>
      </Box>
      <Box
        sx={{
          borderBottom: "1px solid #E1F0FF",
        }}
      ></Box>
      <Box>
        <Typography variant="body2" color={"#666"}>
          Remove from chat
        </Typography>
      </Box>
    </Box>
  );
};

export default SelectBox;
