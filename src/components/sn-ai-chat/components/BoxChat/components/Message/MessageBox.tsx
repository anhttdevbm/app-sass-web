import { Box } from "@mui/material";

export const MessageBox = ({ children, ...props }) => (
  <Box
    bgcolor={"#EBF5FF"}
    borderRadius={"20px"}
    p={2}
    marginLeft={"12px"}
    flex={1}
    display={"flex"}
    justifyContent={"space-around"}
    alignContent={"center"}
    {...props}
  >
    {children}
  </Box>
);
