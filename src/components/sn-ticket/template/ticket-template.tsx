"use client";
import Wrapper from "components/Wrapper";
import Actions from "../module/list-ticket/filter-header/Actions";
import TicketList from "../module/list-ticket/TicketList";
import { Stack } from "@mui/material";

const TicketTemplate = () => {
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
        <TicketList />
      </Stack>
    </Wrapper>
  );
};

export default TicketTemplate;
