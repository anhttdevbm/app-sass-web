"use client";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, Grid, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import { useState } from "react";
import { IFilter, ITimeRangeAction } from "../timeTracking.types";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { NS_TIME_TRACKING } from "constant/index";

export enum TypeNavigator {
  WEEKLY,
  DAILY,
}

interface IProps {
  currentYear: string;
  type: TypeNavigator;
  filters: IFilter;
  selectedDate: dayjs.Dayjs | Date;
  currentDate: string;
  setFilters: (filters: IFilter) => void;
  setSelectedDate: (date: dayjs.Dayjs | Date) => void;
  onAction: (action: ITimeRangeAction) => void;
}

export default function TimeRangeNavigator({
  currentYear,
  type,
  filters,
  selectedDate,
  currentDate,
  setSelectedDate,
  setFilters,
  onAction,
}: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isSmSmaller } = useBreakpoint();
  const timeT = useTranslations(NS_TIME_TRACKING);

  const getWeekStartAndEndDates = (date: dayjs.Dayjs) => {
    const startOfWeek = date?.startOf("week").add(0, "day"); // Ngày bắt đầu tuần (chủ nhật)
    const endOfWeek = date?.startOf("week").add(6, "day"); // Ngày kết thúc tuần (thứ 2)
    const startDate = startOfWeek?.format("YYYY-MM-DD");
    const endDate = endOfWeek?.format("YYYY-MM-DD");
    return { startDate, endDate };
  };
  return (
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isSmSmaller ? "center" : "space-between",
        paddingX: "20px",
        paddingY: isSmSmaller ? "12px" : "0",
      }}
    >
      {!isSmSmaller && <p>Year: {currentYear}</p>}
      {type === TypeNavigator.WEEKLY ? (
        <Grid item sm={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              open={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              onChange={(date) => {
                if (date) {
                  const { startDate, endDate } = getWeekStartAndEndDates(date);
                  setSelectedDate(date);
                  setFilters({
                    ...filters,
                    start_date: startDate,
                    end_date: endDate,
                  });
                }
              }}
              closeOnSelect
              sx={{ display: "none" }}
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
          >
            <Button
              sx={{
                minWidth: "28px",
                height: "28px",
                padding: 0,
                color: "#212529",
              }}
              onClick={() =>
                onAction({
                  action: "week",
                  value: "prev",
                })
              }
            >
              <ChevronLeftIcon />
            </Button>
            <div onClick={() => setIsOpen(true)}>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "neutral.800",
                  margin: "0 10px",
                  fontFamily: "unset",
                  padding: "0 10px",
                  fontWeight: isSmSmaller ? 600 : 400,
                }}
              >
                {`${dayjs(selectedDate)
                  .startOf("week")
                  .format("MMMM D")} - ${dayjs(selectedDate)
                  .endOf("week")
                  .format("MMMM D")}`}
              </Typography>
            </div>
            <Button
              sx={{
                minWidth: "28px",
                height: "28px",
                padding: 0,
                color: "#212529",
              }}
              onClick={() =>
                onAction({
                  action: "week",
                  value: "next",
                })
              }
            >
              <ChevronRightIcon />
            </Button>
          </Stack>
        </Grid>
      ) : (
        <Grid item sm={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              open={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              onChange={(date) => {
                if (date) {
                  const { startDate, endDate } = getWeekStartAndEndDates(date);
                  setSelectedDate(date);
                  setFilters({
                    ...filters,
                    start_date: startDate,
                    end_date: endDate,
                  });
                }
              }}
              closeOnSelect
              sx={{ display: "none" }}
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
          >
            <div onClick={() => setIsOpen(true)}>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "neutral.800",
                  margin: "0 10px",
                  fontFamily: "unset",
                  padding: "0 10px",
                  fontWeight: isSmSmaller ? 600 : 400,
                }}
              >
                {`${dayjs(selectedDate).format("MMMM D")}`}
              </Typography>
            </div>
          </Stack>
        </Grid>
      )}
      {type === TypeNavigator.WEEKLY && !isSmSmaller ? (
        <Grid item sm={12} md={4} sx={{ order: isSmSmaller ? 1 : 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ gap: "3px" }}
          >
            <Button
              sx={{
                minWidth: "28px",
                height: "28px",
                padding: 0,
                // borderRadius: "4px 0px 0px 4px",
                // backgroundColor: "grey.100",
                color: "#212529",
              }}
              onClick={() =>
                onAction({
                  action: "week",
                  value: "prev",
                })
              }
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              sx={{
                width: "97px",
                height: "30px",
                padding: "4px",
                color: "neutral.800",
                textAlign: "center",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#D9F0FD",
                },
              }}
              onClick={() =>
                onAction({
                  action: "week",
                  value: "today",
                })
              }
              disabled={
                dayjs(currentDate).format("YYYY-MM-DD") ===
                dayjs().format("YYYY-MM-DD")
              }
            >
              {type === TypeNavigator.WEEKLY
                ? timeT("company_time.this_week")
                : "To day"}
            </Button>
            <Button
              sx={{
                minWidth: "28px",
                height: "28px",
                padding: 0,
                // borderRadius: "0px 4px 4px 0px",
                // backgroundColor: "grey.100",
                color: "#212529",
              }}
              onClick={() =>
                onAction({
                  action: "week",
                  value: "next",
                })
              }
            >
              <ChevronRightIcon />
            </Button>
          </Stack>
        </Grid>
      ) : (
        <div />
      )}
    </Grid>
  );
}
