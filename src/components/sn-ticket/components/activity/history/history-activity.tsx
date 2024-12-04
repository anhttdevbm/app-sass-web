"use client"

import { Avatar, Box, Stack } from "@mui/material";
import { Text } from "components/shared";
import { useGetListActivity } from "queries/ticket/useGetTicket/useGetListActivity";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
dayjs.extend(duration);

const HistoryActivity = () => {
  const t = useTranslations(NS_TICKET)
  const { data: listHistory } = useGetListActivity(false)

  const calculateTimeDifference = (pastDateString) => {
    const now = dayjs();
    const pastDate = dayjs(pastDateString);
    const difference = now.diff(pastDate);
    const diffDuration = dayjs.duration(difference);
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();
    const seconds = diffDuration.seconds();
    let timeString = '';
    if (hours > 0) {
      timeString += `${hours} ${t("ticketDetail.historyActivity.time")} `;
    }
    // if (minutes > 0) {
    //   timeString += `${minutes} phút `;
    // }
    // if (seconds > 0 || timeString === '') {
    //   timeString += `${seconds} giây`;
    // }

    return timeString.trim();
  };


  console.log("check data history", listHistory?.data)
  return (
    <>
      {listHistory?.data.map((item, index) => {
        return (
          <Stack key={index} direction="row" gap={2} py={2}>
            <Avatar
              src={item?.creatorUser?.urlAvatar}
              alt="Image description"
              sx={{ borderRadius: "100%", height: 30, width: 30 }}
            />
            <Box>
              <Box display="flex" gap={1} alignItems="center">
                <Text fontSize={13} fontWeight={700}>{item?.creatorUser?.fullname}</Text>
                <Text fontSize={13} >{item?.contentHistory}</Text>
                <Text fontSize={10} color="#626F86">{calculateTimeDifference(item?.createTime)}</Text>
              </Box>

              {/* <Box display="flex" gap={1} alignItems="center">
                <Text fontSize={13}>{item?.oldValue}</Text>
                <Text>{"->"}</Text>
                <Text fontSize={13} fontWeight={700}>{item?.newValue}</Text>
              </Box> */}
            </Box>
          </Stack>
        )
      })}




    </>



  )

};
export default HistoryActivity;
