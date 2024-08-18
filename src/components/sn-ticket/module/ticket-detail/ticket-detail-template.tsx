"use client";
import { Box, Typography } from "@mui/material";
import Wrapper from "components/Wrapper";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectTicketDetailData } from "store/ticket-detail/selectors";

const TicketDetail = () => {
    const data = useSelector(selectTicketDetailData);
    console.log("check store detail", data)
  return (
    <Wrapper overflow="auto" inFrame>
      <Box sx={{ padding: "34px 36px" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
          {data?.description} {data?.id}
        </Typography>
      </Box>
    </Wrapper>
  );
};

export default TicketDetail;
