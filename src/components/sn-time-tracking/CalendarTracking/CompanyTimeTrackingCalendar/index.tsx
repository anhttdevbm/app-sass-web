"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import moment from "moment";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";
//import ButtonComponent from "../../Component/Button";
import AddIcon from "@mui/icons-material/Add";
import Filter from "../../../shared/Filter";
//import { MobileDatePicker } from "@mui/x-date-pickers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimeSheet from "./Timesheet";
import { styled } from "@mui/system";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { NS_TIME_TRACKING } from "constant/index";
import ButtonCalendar from "components/shared/ButtonCalendar";
import ListIcon from "@mui/icons-material/List";
import TimeCreate from "../../TimeTrackingModal/TimeCreate";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import CustomizedInputBase from "components/shared/InputSeasrch";
import useTheme from "hooks/useTheme";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useBreakpoint from "hooks/useBreakpoint";
interface IProps {
  events: any[];
  onClick(action: "create" | "edit", item?: any): void;
}

interface IFilter {
  start_date: string;
  end_date: string;
  search_key: string;
}

const today = dayjs(); // Ngày hiện tại + 1 ngày (ngày mai)
const startOfWeek = today.startOf("week").add(0, "day"); // Ngày bắt đầu tuần (chủ nhật)
const endOfWeek = today.startOf("week").add(6, "day"); // Ngày kết thúc tuần (thứ 2)

const defaultStartDate = startOfWeek.format("YYYY-MM-DD");
const defaultEndDate = endOfWeek.format("YYYY-MM-DD");

const DEFAULT_FILTER = {
  start_date: defaultStartDate,
  end_date: defaultEndDate,
  search_key: "",
};

const weekdays = ["SUN", "MON", "TUE", "WEB", "THU", "FRI", "SAT"];

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: "14px",
  lineHeight: "18px",
  fontWeight: 600,
  color: "#999999",
}));

const StyledTableRow = styled(TableRow)(() => ({
  fontSize: "14px",
  lineHeight: "18px",
  fontWeight: 600,
  color: "#999999",
}));

const StyledDay = styled(Box)(() => ({
  cursor: "pointer",
  boxShadow: "-1px -1px 0px 0px #E0E0E0 inset",
  padding: "8px",
  "&.selected": {
    "h3, h4": {
      color: "#3699FF",
    },
  },
  h3: {
    margin: 0,
    fontFamily: "Open Sans",
    fontSize: "10px",
    lineHeight: "18px",
    fontWeight: 400,
    color: "#71717A",
    textTransform: "uppercase",
  },
  h4: {
    margin: 0,
    fontFamily: "Open Sans",
    fontSize: "20px",
    lineHeight: "24px",
    fontWeight: 600,
  },
}));

const TrackingCalendar: React.FC<IProps> = () => {
  const isGetLoading: any = false;
  const timeT = useTranslations(NS_TIME_TRACKING);
  const { isSmSmaller } = useBreakpoint();
  const { isDarkMode } = useTheme();
  const { companyItems: company, onGetCompanyTimeSheet } = useGetMyTimeSheet();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenCreatePopup, setIsOpenCreatePopup] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("timeSheet");
  const [events, setEvents] = React.useState<any[]>([]);
  const [filters, setFilters] = React.useState<IFilter>(DEFAULT_FILTER);
  const [currentDate, setCurrentDate] = React.useState<string>(
    dayjs().toString(),
  );
  const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs | Date>(
    dayjs(),
  );

  const [dateRange, setDateRange] = React.useState<any[]>([]);
  const [totalTime, setTotalTime] = React.useState({
    work: 0,
    break: 0,
  });

  React.useEffect(() => {
    if (!_.isEmpty(company)) {
      const result: any[] = [];
      let totalWorkTime = 0;
      let totalBreakTime = 0;
      _.forEach(company, (user) => {
        if (user && user?.timesheet) {
          let totalUserWorkTime = 0;
          let totalUserBreakTime = 0;
          _.map(user?.timesheet, (data, index: number) => {
            if (!_.isEmpty(data)) {
              const newEvent = {
                title: `Event ${++index}`,
                start: moment(data?.start_time).format("hh:mm A"),
                end: moment(data?.end_time).format("hh:mm A"),
                extendedProps: {
                  project: {
                    avatar: data?.project?.avatar?.link,
                    name: data?.project?.name,
                  },
                  day: data?.day,
                  name: user?.fullname,
                  position: data?.position?.name,
                  start: moment(data?.start_time).format("hh:mm A"),
                  hour: data?.duration,
                  type:
                    data?.type === "Work time" ? "working_time" : "break_time",
                  note: data?.note,
                },
              };
              if (data.type === "Work time") totalUserWorkTime += data.duration;
              else totalUserBreakTime += data.duration;

              result.push(newEvent);
            }
          });
          totalWorkTime += totalUserWorkTime;
          totalBreakTime += totalUserBreakTime;
        }
      });
      setTotalTime({
        work: totalWorkTime,
        break: totalBreakTime,
      });
      setEvents(result);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  React.useEffect(() => {
    if (
      !_.isEmpty(filters) &&
      dayjs(filters?.start_date).isValid() &&
      dayjs(filters?.end_date).isValid()
    ) {
      generateDateRange();
      onGetCompanyTimeSheet(filters);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.start_date, filters?.end_date]);

  const generateDateRange = () => {
    const start_date = dayjs(filters?.start_date);
    const result: Date[] = [];
    let currentDate = start_date?.startOf("week").add(0, "day"); // Ngày bắt đầu tuần (chủ nhật)
    const endOfWeek = start_date?.startOf("week").add(6, "day"); // Ngày kết thúc tuần (thứ 2)

    while (
      currentDate.isBefore(endOfWeek) ||
      currentDate.isSame(endOfWeek, "day")
    ) {
      result.push(currentDate.toDate());
      currentDate = currentDate.add(1, "day");
    }

    setDateRange(result);
  };

  const getWeekStartAndEndDates = (date: any) => {
    const startOfWeek = date?.startOf("week").add(0, "day"); // Ngày bắt đầu tuần (chủ nhật)
    const endOfWeek = date?.startOf("week").add(6, "day"); // Ngày kết thúc tuần (thứ 2)
    const startDate = startOfWeek?.format("YYYY-MM-DD");
    const endDate = endOfWeek?.format("YYYY-MM-DD");
    return { startDate, endDate };
  };

  const onAction = (action: "view" | "week", value: string) => {
    if (action === "week") {
      if (value === "today") {
        const currentDate = new Date();
        const currentDayjs = dayjs().toString();
        setCurrentDate(currentDayjs);
        setSelectedDate(currentDate);
        setFilters(DEFAULT_FILTER);
      }
      if (value === "prev") {
        const startDate = dayjs(filters?.start_date)
          .subtract(7, "day")
          .format("YYYY-MM-DD");
        const endDate = dayjs(filters?.start_date)
          .subtract(1, "day")
          .format("YYYY-MM-DD");
        setFilters({ ...filters, start_date: startDate, end_date: endDate });
        setCurrentDate("");
        setSelectedDate(dayjs(filters?.start_date).subtract(6, "day"));
      }
      if (value === "next") {
        const startDate = dayjs(filters?.end_date)
          .add(1, "day")
          .format("YYYY-MM-DD");
        const endDate = dayjs(filters?.end_date)
          .add(7, "day")
          .format("YYYY-MM-DD");
        setFilters({ ...filters, start_date: startDate, end_date: endDate });
        setCurrentDate("");
        setSelectedDate(dayjs(filters?.end_date).add(2, "day"));
      }
    }
  };

  const _renderCalendarModule = () => {
    return (
      <>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: isSmSmaller ? "0px" : "16px" }}
        >
          <Grid
            container
            rowSpacing={1}
            sx={{ mb: isSmSmaller ? "16px" : "0" }}
          >
            <Grid item md={6} sm={12}>
              <Stack direction="row" alignItems="center" sx={{ gap: "16px" }}>
                <ButtonCalendar
                  icon={<ListIcon />}
                  isActive={activeTab === "timeSheet"}
                  title={timeT("company_time.timesheet")}
                  onClick={() => setActiveTab("timeSheet")}
                />
                <ButtonCalendar
                  icon={<ListIcon />}
                  isActive={activeTab === "table"}
                  title={timeT("company_time.table")}
                  onClick={() => setActiveTab("table")}
                />
              </Stack>
            </Grid>
            <Grid
              item
              md={6}
              sm={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {activeTab === "timeSheet" && (
                <CustomizedInputBase
                  value={filters.search_key}
                  placeholder={timeT("company_time.searchButton")}
                  onChange={(event) => {
                    const searchKey = event.target.value;
                    setFilters({ ...filters, search_key: searchKey });
                    onGetCompanyTimeSheet({
                      ...filters,
                      search_key: searchKey,
                    });
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Stack>
      </>
    );
  };

  const _renderHeader = () => {
    return (
      <Grid container rowSpacing={1} sx={{ mt: 0, mb: 1 }}>
        <Grid item md={3} sm={12}></Grid>
        <Grid
          item
          md={6}
          sm={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { md: "center", sm: "flex-start" },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              open={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              onChange={(date: Date | null) => {
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
            onClick={() => setIsOpen(true)}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: "18px",
                color: "#666666",
                marginRight: "10px",
              }}
            >
              {`${dayjs(filters?.start_date).format("DD MMM YYYY")} - ${dayjs(
                filters?.end_date,
              ).format("DD MMM YYYY")}`}
            </Typography>
            <ExpandMoreIcon sx={{ color: "rgba(102, 102, 102, 1)" }} />
          </Stack>
        </Grid>

        <Grid item md={3} sm={12}>
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
                borderRadius: "4px 0px 0px 4px",
                backgroundColor: "grey.100",
                color: "grey.400",
              }}
              onClick={() => onAction("week", "prev")}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              sx={{
                width: "97px",
                height: "30px",
                backgroundColor: "grey.100",
                padding: "4px",
                color: "grey.400",
                textAlign: "center",
              }}
              onClick={() => onAction("week", "today")}
              disabled={
                dayjs(currentDate).format("YYYY-MM-DD") ===
                dayjs().format("YYYY-MM-DD")
              }
            >
              {timeT("company_time.this_week")}
            </Button>
            <Button
              sx={{
                minWidth: "28px",
                height: "28px",
                padding: 0,
                borderRadius: "0px 4px 4px 0px",
                backgroundColor: "grey.100",
                color: "grey.400",
              }}
              onClick={() => onAction("week", "next")}
            >
              <ChevronRightIcon />
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {_renderCalendarModule()}
        </Grid>

        {activeTab === "table" && (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                borderTop: "1px solid rgb(224, 224, 224)",
                borderLeft: "1px solid rgb(224, 224, 224)",
              }}
            >
              {_.map(dateRange, (date: Date, index) => {
                const weekday = weekdays[date.getDay()];
                const dayNumber = date.getDate();
                return (
                  <StyledDay
                    key={index}
                    className={
                      dayjs(dayjs(date).format("YYYY-MM-DDDD")).isSame(
                        dayjs(selectedDate).format("YYYY-MM-DDDD"),
                      )
                        ? "selected"
                        : ""
                    }
                    onClick={() => setSelectedDate(date)}
                  >
                    <h3>{weekday}</h3>
                    <Typography
                      variant="h4"
                      sx={{
                        color: isDarkMode
                          ? "common.white!important"
                          : "common.black",
                      }}
                    >
                      {dayNumber}
                    </Typography>
                  </StyledDay>
                );
              })}
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  const dataDayTable = useMemo(() => {
    if (!_.isEmpty(events)) {
      return events?.filter((item) => {
        return (
          dayjs(item?.extendedProps?.day).format("YYYY-MM-DD") ===
          dayjs(selectedDate).format("YYYY-MM-DD")
        );
      });
    }
  }, [events, selectedDate]);

  const _renderTimeSheetContent = () => {
    if (activeTab !== "timeSheet") return;
    return <TimeSheet data={company} filters={filters} dateRange={dateRange} />;
  };

  const _renderFooter = () => {
    return (
      <Stack
        direction="column"
        alignItems="center"
        sx={{ marginTop: "16px", color: isDarkMode ? "#fff" : "#212121" }}
      >
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
          {timeT("header.tab.weekly_total")}
        </Typography>
        <Stack direction="row">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,

              marginRight: "16px",
            }}
          >
            {timeT("header.tab.workTime")}: {totalTime.work}h
          </Typography>
          <Typography sx={{ fontSize: "16px", fontWeight: 400 }}>
            {timeT("header.tab.breakTime")}: {totalTime.break}h
          </Typography>
        </Stack>
      </Stack>
    );
  };

  const _redderCreatePopup = () => (
    <TimeCreate
      open={isOpenCreatePopup}
      onClose={() => setIsOpenCreatePopup(false)}
      filters={filters}
      currentScreen="companyTime"
    />
  );

  return (
    <Stack direction="column">
      {_renderHeader()}
      {activeTab === "table" ? (
        <Stack
          //ref={scrollRef}
          sx={{
            height: `calc(100vh - 430px)`,
            overflow: "auto",
            position: "relative",
          }}
        >
          <Grid container spacing={1} sx={{ height: "calc(100vh - 380px)" }}>
            <Grid item xs={12}>
              <TableContainer
                sx={{
                  borderLeft: "1px solid rgb(224, 224, 224)",

                  //height: "calc(100vh - 420px)",
                }}
              >
                <Table
                  sx={{
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                    position: "relative",
                    bottom: "-7px",
                  }}
                  stickyHeader={true}
                >
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>
                        {timeT("company_time.table_tab.employee")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {timeT("company_time.table_tab.project")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {timeT("company_time.table_tab.position")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {timeT("company_time.table_tab.start_time")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {timeT("company_time.table_tab.time")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {timeT("company_time.table_tab.note")}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {!_.isEmpty(dataDayTable) ? (
                      dataDayTable?.map((event, index) => {
                        const rowStyles = {
                          borderLeft: `4px solid rgba(54, 153, 255, 1)`,
                          backgroundColor: "primary.light",
                        };
                        if (event?.extendedProps?.type === "break_time")
                          Object.assign(rowStyles, {
                            borderLeft: `4px solid rgba(246, 78, 96, 1)`,
                            backgroundColor: "error.light",
                          });
                        return (
                          <StyledTableRow sx={rowStyles} key={index}>
                            <StyledTableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                <Avatar sx={{ width: 20, height: 20 }} />
                                {event?.extendedProps?.name}
                              </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                <Avatar sx={{ width: 20, height: 20 }} src={event?.extendedProps?.avatar} />
                                {event?.extendedProps?.project?.name || "No Project"}
                              </Box>
                            </StyledTableCell>

                            <StyledTableCell>
                              {event?.extendedProps?.position}
                            </StyledTableCell>
                            <StyledTableCell>
                              {event?.extendedProps?.start}
                            </StyledTableCell>
                            <StyledTableCell>
                              {" "}
                              {event?.extendedProps?.hour || 0}h
                            </StyledTableCell>
                            <StyledTableCell>
                              {event?.extendedProps?.note}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell
                          colSpan={9}
                          align="center"
                          sx={{
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 400,
                            p: 1,
                            widtH: 1,
                            textAlign: "center",
                          }}
                        >
                          {timeT("header.noData")}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}

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
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <Stack
          //ref={scrollRef}
          sx={{
            height: `calc(100vh - 370px)`,
            overflow: "auto",
            position: "relative",
          }}
        >
          {_renderTimeSheetContent()}
        </Stack>
      )}

      {_renderFooter()}
      {_redderCreatePopup()}
    </Stack>
  );
};

export default TrackingCalendar;
