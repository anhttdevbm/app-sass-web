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
import { Box, Stack, TableRow } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setContentRow } from "store/docs/reducer";
import { DOCS_API_URL } from "constant/index";
import axiosBaseQuery from "store/axiosBaseQuery";
import { useRouter } from "next-intl/client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";

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
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box>
            <GroupIcon sx={{ fontSize: 20 }} htmlColor="grey" />
            <ArticleIcon sx={{ fontSize: 20 }} htmlColor="dodgerblue" />
          </Box>
          <Text fontSize={14}>{item?.name}</Text>
        </Box>
      </BodyCell>
      <BodyCell align="center">
        {item?.created_by?.id ? (
          <Stack
            // justifyContent={"center"}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Avatar size={20} src={item.created_by?.avatar?.link} />
            <Text fontSize={14} color="grey.700" whiteSpace="nowrap">
              Created by
            </Text>
            <Text fontWeight={600} fontSize={14}>
              {item.created_by?.fullname}
            </Text>
          </Stack>
        ) : null}
      </BodyCell>
      <BodyCell>
        <Box display="flex" gap={1} alignItems="center">
          <AccessTimeIcon sx={{ fontSize: 20 }} htmlColor="grey" />
          <Text fontSize={14} whiteSpace="nowrap" color="grey.700">
            Updated {formatTime(item.updated_time)}
          </Text>
        </Box>
      </BodyCell>
      <BodyCell>{""}</BodyCell>
    </>
  );
};

export default memo(DesktopCells);
