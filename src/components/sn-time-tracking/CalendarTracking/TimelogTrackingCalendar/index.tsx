/* eslint-disable react-hooks/exhaustive-deps */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import {
  Avatar,
  Box,
  Divider,
  // Grid,
  Link,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import Filter from "../../../shared/Filter";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { ENUMS } from "../../Component/Constants";
import CustomizedInputBase from "components/shared/InputSeasrch";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import { WorkLogItem } from "store/timeTracking/reducer";
import useTheme from "hooks/useTheme";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { NS_TIME_TRACKING } from "constant/index";

const { TASK_ACTION } = ENUMS;

interface IProps {
  events: any[];
  onClick(action: "create" | "edit", item?: any): void;
}

interface ITimeLogStructure {
  id: string;
  user_id: string;
  user: any;
  project_id: string;
  project: any;
  task_id: string;
  task_name: string;
  task_number: string;
  created_time: string;
  action: string;
}

const TimelogTrackingCalendar: React.FC<IProps> = ({}) => {
  //const dispatch = useTypedDispatch();
  const { workLog, onGetWorkLog } = useGetMyTimeSheet();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const isGetLoading: any = false;
  const [isOpen, setIsOpen] = useState(false);
  const [timeLogs, setTimeLogs] = useState<WorkLogItem[]>([]);
  const [filters, setFilters] = useState({
    search_key: "",
    date: dayjs().format("YYYY-MM-DD"),
  });
  const timeT = useTranslations(NS_TIME_TRACKING);

  const taskActionStrings = {
    [TASK_ACTION.CREATE_TASK_LIST]: timeT("timeLog.createTL"),
    [TASK_ACTION.MOVE_TASK]: timeT("timeLog.moveT"),
    [TASK_ACTION.UPDATE_INACTIVE_TASK_LIST]: timeT("timeLog.upITL"),
    [TASK_ACTION.UPDATE_TASK_LIST]: timeT("timeLog.upTL"),
    [TASK_ACTION.UPDATE_TASK]: timeT("timeLog.upT"),
    [TASK_ACTION.UPDATE_SUB_TASK]: timeT("timeLog.upST"),
    [TASK_ACTION.UPDATE_INACTIVE_TASK]: timeT("timeLog.upIT"),
    [TASK_ACTION.UPDATE_INACTIVE_SUB_TASK]: timeT("timeLog.upIST"),
    [TASK_ACTION.CREATE_TASK]: timeT("timeLog.creT"),
    [TASK_ACTION.CREATE_SUB_TASK]: timeT("timeLog.creST"),
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  function scrollToTop() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }
  useEffect(() => {
    onGetWorkLog(filters);
  }, []);

  useEffect(() => {
    if (workLog?.data?.length) {
      setTimeLogs(workLog.data);
    } else {
      setTimeLogs([]);
    }
  }, [workLog]);

  const getTaskActionString = (action: string) => {
    return taskActionStrings[action as keyof typeof taskActionStrings] || "";
  };
  const _renderItem = useCallback(() => {
    if (_.isEmpty(timeLogs) && !isGetLoading)
      return (
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "18px",
            fontWeight: 400,
            color: "#666666",
          }}
        >
          No data were found
        </Typography>
      );
    return _.map(timeLogs, (timeLog: ITimeLogStructure, index: number) => {
      return (
        <Box key={timeLog?.id || index}>
          <Stack direction="row" alignItems="center" padding="10px 0">
            <Stack
              direction="column"
              sx={{
                padding: "0 7px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: "#666666",
                  textAlign: "center",
                }}
              >
                {dayjs(timeLog?.created_time).format("HH:mm")}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#1BC5BD",
                margin: "0 8px 0 15px",
              }}
            />
            <Avatar
              src={timeLog?.user?.avatar?.link}
              sx={{ width: "32px", height: "32px", marginRight: "8px" }}
            />
            <Stack direction="column">
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: "#666666",
                }}
              >
                <Link
                  sx={{
                    color: isDarkMode ? "common.white" : "#212121",
                    textDecoration: "none",
                    marginRight: "8px",
                  }}
                >
                  {timeLog?.user?.email}
                </Link>
                {getTaskActionString(timeLog.action)}
                <Typography
                  component="span"
                  sx={{
                    color: "#3699FF",
                    textDecoration: "none",
                    margin: "0 6px",
                  }}
                >
                  {`${timeLog?.task_number ? `#${timeLog.task_number}` : ""} ${
                    timeLog?.task_name ? "-" : ""
                  } ${timeLog?.task_name}`}
                </Typography>
                in {timeLog?.project?.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: isDarkMode ? "common.white" : "#212121",
                }}
              >
                {timeLog?.user?.position?.name}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ margin: "0" }} />
        </Box>
      );
    });
  }, [timeLogs]);

  const _renderCalendarModule = () => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: "16px" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            open={isOpen}
            disableFuture
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onChange={(date: any) => {
              const newDate = dayjs(date).format("YYYY-MM-DD");
              const newFilters = { ...filters, date: newDate };

              setFilters(newFilters);
              onGetWorkLog(newFilters).then(() => {
                scrollToTop();
              });
            }}
            sx={{ display: "none" }}
            closeOnSelect
            slotProps={{
              actionBar: {
                actions: [],
              },
              toolbar: {
                hidden: true,
              },
              day: {
                sx: {
                  transition: "all ease 0.25s",
                  borderRadius: "4px",
                  fontWeight: 600,
                  "&.Mui-selected": {
                    color: "#ffffff",
                    backgroundColor: `rgba(54, 153, 255, 1) !important`,
                    "&.MuiPickersDay-today": {
                      color: "#ffffff",
                      borderColor: "rgba(54, 153, 255, 1)",
                    },
                  },
                  "&.MuiPickersDay-today": {
                    color: "rgba(54, 153, 255, 1)",
                    borderColor: "rgba(54, 153, 255, 1)",
                  },
                  ":hover": {
                    background: "rgba(54, 153, 255, 1)",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            ":hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "18px",
              color: "#666666",
              marginRight: "10px",
            }}
          >
            {filters?.date
              ? dayjs(filters?.date).format("DD MMM YYYY")
              : "Choose time range"}
          </Typography>
          <ExpandMoreIcon sx={{ color: "rgba(102, 102, 102, 1)" }} />
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack direction="column">
      {_renderCalendarModule()}
      <Stack
        ref={scrollRef}
        sx={{
          width: 1,
          height: `calc(100vh - 300px)`,
          overflow: "auto",
          position: "relative",
        }}
      >
        {isGetLoading && (
          <Box
            sx={{
              position: "absolute",
              width: 1,
              height: 1,
              top: 0,
              left: 0,
              backgroundColor: " rgba(0, 0, 0, 0.1)",
              webkitTapHighlightColor: "transparent",
            }}
          >
            <Stack
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 1,
                width: 1,
              }}
            >
              <CircularProgress />
            </Stack>
          </Box>
        )}
        {_renderItem()}
      </Stack>
    </Stack>
  );
};

export default TimelogTrackingCalendar;
