"use client"

import { Box, Stack } from "@mui/material";
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
            <Box
              component="img"
              height="30px"
              width="30px"
              src={
                item?.creatorUser?.urlAvatar ?
                  item?.creatorUser?.urlAvatar :
                  "https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__"}
              alt="Image description"
              sx={{ borderRadius: "100%" }}
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
