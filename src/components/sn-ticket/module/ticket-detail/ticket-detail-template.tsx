"use client";
import { Box, Typography } from "@mui/material";
import Wrapper from "components/Wrapper";

const TicketDetail = () => {
  return (
    <Wrapper overflow="auto" inFrame>
      <Box sx={{ padding: "34px 36px" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
          Ticket
        </Typography>
      </Box>
    </Wrapper>
  );
};

export default TicketDetail;
