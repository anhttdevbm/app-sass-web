/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { BodyCell } from "components/Table";
import {
  DATE_TIME_FORMAT_HYPHEN,
  DATE_TIME_FORMAT_SLASH,
  DATE_LOCALE_FORMAT,
} from "constant/index";
import { formatDate, formatNumber } from "utils/index";
import { Position } from "store/company/reducer";
import { Text } from "components/shared";
import Avatar from "components/Avatar";
import { Stack, TableRow } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setContentRow } from "store/docs/reducer";
import { DOCS_API_URL } from "constant/index";
import axiosBaseQuery from "store/axiosBaseQuery";
import { useRouter } from "next-intl/client";

type DesktopCellsProps = {
  item: any;
};

function formatTime(dateTimeString) {
  const time: any = new Date(dateTimeString);
  const currentTime: any = new Date();
  const timeDifference: any = currentTime - time;
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    const formattedDay = time.getDate().toString().padStart(2, "0");
    const formattedMonth = getShortMonthName(time.getMonth());
    const formattedYear = time.getFullYear();

    return `${formattedDay} ${formattedMonth}, ${formattedYear}`;
  }
}

function getShortMonthName(month) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month];
}

const DesktopCells = (props: DesktopCellsProps) => {
  const { item } = props;
  const { push } = useRouter();
  const dispatch = useDispatch();
  const api = axiosBaseQuery({ baseUrl: DOCS_API_URL });
  return (
    <>
      <BodyCell align="left">
        <div
        style={{cursor: 'pointer'}}
          onClick={async () => {
            const result: any = await api(
              {
                url: `/docs/detail/${item.id}`,
                method: "GET",
                //@ts-ignore
              }, {}, {});
            if (result.error) {
              console.error("Error:", result.error);
            } else {
              await dispatch(setContentRow(result?.data?.content));
              push(`/documents/${item.id}`);
            }
          }}
        >
          <Text fontWeight={600} fontSize={14}>
            {item?.name}
          </Text>
        </div>
      </BodyCell>
      <BodyCell>{dayjs(item.updated_time).format(DATE_LOCALE_FORMAT)}</BodyCell>
      <BodyCell>{formatTime(item.updated_time)}</BodyCell>
      <BodyCell sx={{ py: "10px" }} align="center">
        {item?.created_by?.id ? (
          <Stack
            // justifyContent={"center"}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Avatar size={32} src={item.created_by?.avatar?.link} />
            <Stack
              justifyContent={"start"}
              alignItems={"start"}
              direction={"column"}
            >
              <Text fontWeight={600} fontSize={14}>
                {item.created_by?.fullname}
              </Text>
              <Text fontWeight={400} fontSize={14}>
                {item?.created_by?.position?.name}
              </Text>
            </Stack>
          </Stack>
        ) : null}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
