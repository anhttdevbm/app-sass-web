"use client";
import Wrapper from "components/Wrapper";
import Actions from "../Actions";
import TicketList from "../TicketList";
import { Stack } from "@mui/material";

const TicketTemplate = () => {
  return (
    <Wrapper overflow="auto" inFrame>
      <Stack sx={{ overflowY: "auto", scrollbarWidth: "none", height: "100vh" }}
      >
        <Actions isProjectTabMode={false} />
        <TicketList />
      </Stack>

    </Wrapper>
  );
};

export default TicketTemplate;
