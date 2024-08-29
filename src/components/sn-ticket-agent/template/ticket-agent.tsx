"use client";
import Wrapper from "components/Wrapper";
import Actions from "../Actions";
import { Stack } from "@mui/material";
import TicketAgentList from "../TicketAgentList";

const TicketAgent = () => {

  return (
    <Wrapper overflow="auto" inFrame>
      <Stack
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          height: "calc(100vh - 100px)",
        }}
      >
        <Actions isProjectTabMode={false} />
        <TicketAgentList/>
      </Stack>
    </Wrapper>
  );
};

export default TicketAgent;
