"use client";
import Wrapper from "components/Wrapper";
import { Stack } from "@mui/material";
import Actions from "../module/Actions";
import Items from "../module/item-dashboad"


const DashBoardTicket = () => {
  return (
    <Wrapper overflow="auto" inFrame>
      <Stack
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          height: "calc(100vh - 100px)",
          padding: {xs :"24px 12px", md :"24px 24px"}
        }}
      >
        <Actions />
        <Items/>
      </Stack>
    </Wrapper>
  );
};

export default DashBoardTicket;
