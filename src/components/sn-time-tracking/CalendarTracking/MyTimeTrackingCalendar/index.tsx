"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react"; // Import DateClickArg type
import timeGridPlugin from "@fullcalendar/timegrid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { calendarStyles } from "./TrackingCalendar.styles";

import interactionPlugin from "@fullcalendar/interaction";
import ListIcon from "@mui/icons-material/List";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ButtonCalendar from "components/shared/ButtonCalendar";
import CustomizedInputBase from "components/shared/InputSeasrch";
import { NS_COMMON, NS_TIME_TRACKING } from "constant/index";
import useTheme from "hooks/useTheme";
import CalendarIcon from "icons/CalendarIcon";
import DayIcon from "icons/DayIcon";
import PlusIcon from "icons/PlusIcon";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import TimeCreate from "../../TimeTrackingModal/TimeCreate";
import TimeSheet from "./TimeSheet";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import useBreakpoint from "hooks/useBreakpoint";
import DuplicateIcon from "icons/DuplicateIcon";
import { getSameWorker } from "store/timeTracking/actions";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    borderLeft: "3px solid transparent",
    borderRadius: "2px",
    minWidth: "176px",
    boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.10)",
    padding: "4px 10px",
  },

  "& .MuiTooltip-arrow": {
    color: "#fff",
  },
}));

const eventStyles = {
  working_time: {
    borderLeft: `4px solid rgba(54, 153, 255, 1)`,
    background: "rgba(225, 240, 255, 1)",
  },
  break_time: {
    borderLeft: `4px solid rgba(246, 78, 96, 1)`,
    background: "rgba(246, 78, 96, 0.1)",
  },
};

const subEventDayStyles = {
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "18px",
  color: "#212121",
};

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
    //color: "#212121",
  },
}));

const TrackingCalendar: React.FC<IProps> = () => {
  const {
    items: myTime,
    onGetMyTimeSheet,
    onUpdateTimeSheet,
  } = useGetMyTimeSheet();
  const { isDarkMode } = useTheme();
  const { onAddSnackbar } = useSnackbar();
  const timeT = useTranslations(NS_TIME_TRACKING);
  const { isSmSmaller } = useBreakpoint();
  const isGetLoading: any = false;
  const { user: userData } = useAuth();

  const calendarRef = React.useRef<FullCalendar>(null);
  const [filters, setFilters] = React.useState<IFilter>(DEFAULT_FILTER);
  const prevFilters = React.useRef<IFilter>(DEFAULT_FILTER);
  prevFilters.current = filters;

  const [currentDate, setCurrentDate] = React.useState<string>(
    dayjs().toString(),
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenCreatePopup, setIsOpenCreatePopup] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("timeSheet");
  const [events, setEvents] = React.useState<any[]>([]);

  const [sameTime, setSameTime] = useState({});
  const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs | Date>(
    dayjs(),
  );

  const [dateClick, setDateClick] = React.useState<string>("");

  const [dateRange, setDateRange] = React.useState<any[]>([]);
  const [totalTime, setTotalTime] = React.useState({
    work: 0,
    break: 0,
  });
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    _.forEach(myTime, (timesheet) => {
      const idEvent = timesheet?.id;
      getSameWorker({ id: idEvent }).then(async (res) => {
        const cloneObject = _.cloneDeep(sameTime);

        cloneObject[idEvent] = res || [];
        setSameTime((state) => ({ ...state, ...cloneObject }));
      });
    });
  }, [myTime]);

  React.useEffect(() => {
    if (!_.isEmpty(myTime)) {
      const result: any[] = [];
      let totalWorkTime = 0;
      let totalBreakTime = 0;
      _.forEach(myTime, (timesheet) => {
        const newEvent = {
          title: timesheet?.project?.name,
          start: timesheet?.start_time,
          end: timesheet?.end_time,
          extendedProps: {
            id: timesheet?.id,
            date: timesheet?.day,
            start_time: moment(timesheet?.start_time).format("hh:mm A"),
            project: timesheet?.project,
            avatar: userData?.avatar?.link,
            day: timesheet?.day,
            name: userData?.fullname,
            position: timesheet?.position,
            hour: timesheet?.duration,
            typeDefault: timesheet?.type,
            type:
              timesheet?.type === "Work time" ? "working_time" : "break_time",
            note: timesheet?.note,
          },
        };
        if (timesheet.type === "Work time") totalWorkTime += timesheet.duration;
        else totalBreakTime += timesheet.duration;

        result.push(newEvent);
      });

      setTotalTime({
        work: totalWorkTime,
        break: totalBreakTime,
      });
      setEvents(result);
    }
  }, [myTime, userData]);

  React.useEffect(() => {
    if (
      !_.isEmpty(filters) &&
      dayjs(filters?.start_date).isValid() &&
      dayjs(filters?.end_date).isValid()
    ) {
      generateDateRange();
      onGetMyTimeSheet(filters);
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

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [eventDulicate, setEventDulicate] = useState<any | null>(null);
  const open = Boolean(menuAnchorEl);
  const handleOpenEventMenu = (event, eventData) => {
    setEventDulicate(eventData);
    setMenuAnchorEl(event);
  };
  const handleCloseEventMenu = () => {
    setMenuAnchorEl(null);
    setEventDulicate(null);
  };
  const handleDuplicateEvent = () => {
    const eventData = {
      extendedProps: {
        ...eventDulicate._def.extendedProps,
        id: null,
      },
    };
    setIsEdit(true);
    setSelectedEvent(eventData);
    setIsOpenCreatePopup(true);
    handleCloseEventMenu();
  };

  const handleDateSelect = (selectInfo) => {
    if (
      selectInfo.view.type === "timeGridWeek" ||
      selectInfo.view.type === "timeGridDay"
    ) {
      const duration = moment
        .duration(moment(selectInfo.end).diff(moment(selectInfo.start)))
        .hours();

      const eventData = {
        ...selectInfo,
        extendedProps: {
          day: moment(selectInfo.start).format("YYYY-MM-DD"),
          hour: duration,
        },
      };
      setIsEdit(true);
      setSelectedEvent(eventData);
      setIsOpenCreatePopup(true);
    }
  };

  const getWeekStartAndEndDates = (date: any) => {
    const startOfWeek = date?.startOf("week").add(0, "day"); // Ngày bắt đầu tuần (chủ nhật)
    const endOfWeek = date?.startOf("week").add(6, "day"); // Ngày kết thúc tuần (thứ 2)
    const startDate = startOfWeek?.format("YYYY-MM-DD");
    const endDate = endOfWeek?.format("YYYY-MM-DD");
    return { startDate, endDate };
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const onGoDay = (value: Date) => {
    const calendarApi = calendarRef?.current && calendarRef?.current.getApi();
    calendarApi?.gotoDate(dayjs(value).format("YYYY-MM-DD"));
  };
  const onAction = (action: "view" | "week", value: string) => {
    const calendarApi = calendarRef?.current && calendarRef?.current.getApi();

    if (action === "week") {
      if (value === "today") {
        const currentDate = new Date();
        const currentDayjs = dayjs().toString();
        setCurrentDate(currentDayjs);
        setSelectedDate(dayjs());
        setFilters(DEFAULT_FILTER);
        if (calendarApi) {
          calendarApi.gotoDate(currentDate);
          calendarApi.refetchEvents();
        }
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

        if (calendarApi) {
          calendarApi.prev();
          calendarApi.refetchEvents();
        }
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
        if (calendarApi) {
          calendarApi.next();
          calendarApi.refetchEvents();
        }
      }
    }
  };

  const _renderCalendarModule = () => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: "16px" }}
      >
        <Grid container rowSpacing={1}>
          <Grid
            item
            md={6}
            sm={12}
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <ButtonCalendar
              icon={<ListIcon />}
              isActive={activeTab === "timeSheet"}
              title={timeT("myTime.timesheet")}
              onClick={() => handleTabChange("timeSheet")}
            />
            <ButtonCalendar
              icon={<CalendarIcon />}
              isActive={activeTab === "timeGridWeek"}
              title={timeT("myTime.calender")}
              onClick={() => {
                onAction("view", "timeGridWeek");
                handleTabChange("timeGridWeek");
              }}
            />
            <ButtonCalendar
              icon={<DayIcon />}
              isActive={activeTab === "dayGridWeek"}
              title={timeT("myTime.day")}
              onClick={() => handleTabChange("dayGridWeek")}
            />
          </Grid>
          <Grid
            item
            md={6}
            sm={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            {activeTab === "timeSheet" && (
              <CustomizedInputBase
                value={filters.search_key}
                placeholder={timeT("myTime.searchButton")}
                onChange={(event) => {
                  const searchKey = event.target.value;
                  setFilters({ ...filters, search_key: searchKey });
                  onGetMyTimeSheet({
                    ...filters,
                    search_key: searchKey,
                  });
                }}
              />
            )}
          </Grid>
        </Grid>
      </Stack>
    );
  };

  const _renderHeader = () => {
    return (
      <>
        <Grid container rowSpacing={1}>
          <Grid
            item
            sm={12}
            md={4}
            sx={{ width: "100%", order: isSmSmaller ? 3 : 1 }}
          >
            <Button
              startIcon={<PlusIcon />}
              size="small"
              variant="contained"
              sx={{
                height: "36px",
                width: "113px",
                padding: 0,
                backgroundColor: "primary.main",
                color: "common.white",
                textTransform: "none",
              }}
              onClick={() => setIsOpenCreatePopup(true)}
            >
              {timeT("myTime.addButton")}
            </Button>
          </Grid>
          <Grid
            item
            sm={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              order: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                onChange={(date: Date | null) => {
                  if (date) {
                    const { startDate, endDate } =
                      getWeekStartAndEndDates(date);
                    setSelectedDate(date);
                    onGoDay(date);
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
                  fontSize: "14px",
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
        </Grid>
        {_renderCalendarModule()}
      </>
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

  const _renderFooter = () => {
    return (
      <Stack
        direction="column"
        alignItems="center"
        sx={{ marginTop: "15px", color: isDarkMode ? "#fff" : "#212121" }}
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
      onClose={() => {
        setIsOpenCreatePopup(false);
        setIsEdit(false);
        setDateClick("");
      }}
      filters={filters}
      currentScreen="myTime"
      isEdit={isEdit}
      selectedEvent={selectedEvent}
      dateClick={dateClick}
    />
  );

  const _renderTimeSheetContent = () => {
    if (activeTab !== "timeSheet") return;
    return <TimeSheet data={myTime} filters={filters} dateRange={dateRange} />;
  };

  return (
    <Stack
      direction="column"
      sx={{
        ".fc-toolbar .fc-timeGridWeek-button": {
          display: "none",
        },
      }}
    >
      {_renderHeader()}
      <Stack
        //ref={scrollRef}
        sx={{
          height: `calc(100vh - 365px)`,
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* {_renderCalendarModule()} */}

        {_renderTimeSheetContent()}
        {true && (
          <Stack
            sx={{
              ...calendarStyles,
              display: activeTab === "timeGridWeek" ? "block" : "none",
              flexGrow: 1,
              minHeight: 0,
              minWidth: 0,
            }}
            className={`view-timeGridWeek`}
          >
            <Box
              sx={{
                height: "100%",
                ".fc-timegrid-slot-label-cushion": {
                  padding: "0 8px",
                  height: "36px",
                  display: "flex",
                },
                ".fc-day.fc-day-sun, .fc-day.fc-day-sat, .fc-timegrid-axis, colgroup":
                  {
                    backgroundColor: isDarkMode ? "rgb(86, 86, 86)" : "#FAFAFA",
                    ...(isDarkMode && {
                      color: "#fff",
                    }),
                  },
                ".fc-timegrid-axis .fc-timegrid-axis-frame": {
                  color: isDarkMode ? "#fff" : undefined,
                },
                "colgroup, colgroup col": {
                  width: "112px !important",
                },
              }}
            >
              <FullCalendar
                ref={calendarRef}
                scrollTime="01:00:00"
                scrollTimeReset={true}
                slotDuration="01:00:00"
                slotMinWidth={112}
                height={`calc(100vh - 365px)`}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                selectable={true}
                select={handleDateSelect}
                selectConstraint={{
                  startTime: "00:01",
                  endTime: "23:59",
                }}
                eventResize={({ event, endDelta }) => {
                  const date = dayjs(event.start).format("YYYY-MM-DD") || "";
                  const time =
                    dayjs(event.start).format("YYYY-MM-DD HH:mm") || "";
                  const dataUpdate = {
                    day: date,
                    duration:
                      event?._def?.extendedProps.hour +
                      endDelta.milliseconds / 1000 / 60 / 60,
                    id: event?._def?.extendedProps?.id,
                    note: event?._def?.extendedProps?.note,
                    position: event?._def?.extendedProps?.position?.id,
                    project_id: event?._def?.extendedProps?.project?.id,
                    start_time: time,
                    type:
                      event?._def?.extendedProps?.type === "working_time"
                        ? "Work time"
                        : "Break time",
                  };
                  onUpdateTimeSheet({
                    ...dataUpdate,
                  })
                    .then((res) => {
                      onAddSnackbar("Update timesheet success", "success");
                    })
                    .catch((err) => {
                      onAddSnackbar("Update timesheet failure", "error");
                    })
                    .finally(() => {
                      onGetMyTimeSheet(filters);
                    });
                }}
                eventClick={(eventInfo) => {
                  setIsEdit(true);
                  setSelectedEvent(eventInfo?.event);

                  setIsOpenCreatePopup(true);
                }}
                initialView={"timeGridWeek"}
                //weekends={true}
                editable={true}
                droppable={true}
                eventDrop={({ event }) => {
                  const date = dayjs(event.start).format("YYYY-MM-DD") || "";
                  const time =
                    dayjs(event.start).format("YYYY-MM-DD HH:mm") || "";
                  const dataUpdate = {
                    day: date,
                    duration: event?._def?.extendedProps?.hour,
                    id: event?._def?.extendedProps?.id,
                    note: event?._def?.extendedProps?.note,
                    position: event?._def?.extendedProps?.position?.id,
                    project_id: event?._def?.extendedProps?.project?.id,
                    start_time: time,
                    type:
                      event?._def?.extendedProps?.type === "working_time"
                        ? "Work time"
                        : "Break time",
                  };
                  onUpdateTimeSheet({
                    ...dataUpdate,
                  })
                    .then((res) => {
                      onAddSnackbar("Update timesheet success", "success");
                    })
                    .catch((err) => {
                      onAddSnackbar("Update timesheet failure", "error");
                    });
                }}
                headerToolbar={false}
                allDaySlot={false}
                events={events}
                dayHeaderContent={(eventInfo: {
                  date: Date;
                  text: string;
                  isToday: boolean;
                }) => {
                  // const date = dayjs(eventInfo.date);
                  const dayOfWeek = eventInfo.text.split(" ").shift();
                  // const isSelected = dayjs(dayjs(date).format('YYYY-MM-DDDD')).isSame(
                  //   dayjs(selectedDate).format('YYYY-MM-DDDD')
                  // );
                  return (
                    <Stack
                      direction="column"
                      // sx={{ cursor: 'pointer' }}
                      // onClick={() => {
                      //   setSelectedDate(date);
                      // }}
                    >
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontSize: "10px",
                          fontWeight: 400,
                          textAlign: "left",
                          // color: isSelected ? CommonColors.brandColor : '#71717A',
                        }}
                      >
                        {dayOfWeek}
                      </Typography>
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontSize: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          // color: isSelected ? CommonColors.brandColor : '#212121',
                        }}
                      >
                        {dayjs(eventInfo?.date).isValid() &&
                          dayjs(eventInfo?.date).format("DD")}
                      </Typography>
                    </Stack>
                  );
                }}
                eventContent={(eventInfo) => {
                  const type = eventInfo?.event?.extendedProps?.type;
                  const styles =
                    eventStyles[type as "working_time" | "break_time"];
                  const boxStyles = {
                    position: "relative",
                    ...styles,
                    height: "100%",
                    padding: "0 6px",
                  };
                  if (type === "working_time")
                    return (
                      <HtmlTooltip
                        title={
                          <>
                            <Stack
                              direction="column"
                              sx={{ backgroundColor: "common.white" }}
                              gap={2 / 8}
                              // {...bindToggle(popupState)}
                            >
                              <Stack direction="row" alignItems="center">
                                <Avatar
                                  sx={{
                                    width: "20px",
                                    height: "20px",
                                    marginTop: "6px",
                                  }}
                                  src={eventInfo?.event?.extendedProps?.avatar}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    lineHeight: "18px",
                                    marginTop: "6px",
                                    marginLeft: "4px",
                                    color: "primary.main",
                                  }}
                                >
                                  {eventInfo?.event?.extendedProps.name}
                                </Typography>
                              </Stack>
                              <Typography sx={subEventDayStyles}>
                                {eventInfo?.event?.extendedProps?.position
                                  ?.name || "--"}
                              </Typography>
                              <Typography sx={subEventDayStyles}>
                                {eventInfo?.event?.extendedProps.hour}h
                              </Typography>

                              <Stack
                                className="same-time-worker"
                                // sx={{
                                //   visibility: "hidden",
                                //   transition: "all .3s ease-in-out",
                                // }}
                              >
                                {!_.isEmpty(sameTime) &&
                                  sameTime[
                                    `${eventInfo?.event?.extendedProps?.id}`
                                  ]?.length > 0 && (
                                    <>
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          lineHeight: "18px",
                                          fontWeight: 400,
                                          color: "#212121",
                                          mb: 1,
                                        }}
                                      >
                                        {timeT(
                                          "myTime.calender_tab.same_time_worker",
                                        )}
                                        :
                                      </Typography>
                                      {sameTime[
                                        `${eventInfo?.event?.extendedProps?.id}`
                                      ]?.map((item, index) => {
                                        return (
                                          <Box
                                            key={index}
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                              mb: 1,
                                            }}
                                          >
                                            <Avatar
                                              sx={{ width: 20, height: 20 }}
                                              src={item?.avatar?.link}
                                            />
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                lineHeight: "16px",
                                                color: "#000",
                                              }}
                                            >
                                              {item.fullname}
                                            </Typography>
                                          </Box>
                                        );
                                      })}
                                    </>
                                  )}
                              </Stack>
                            </Stack>
                          </>
                        }
                        sx={{
                          ".MuiTooltip-tooltip": {
                            borderLeftColor: "#3699FF",
                          },
                        }}
                      >
                        <Stack
                          direction="column"
                          sx={boxStyles}
                          // {...bindToggle(popupState)}
                        >
                          <Stack direction="row" alignItems="center">
                            <Avatar
                              sx={{
                                width: "20px",
                                height: "20px",
                                marginTop: "6px",
                              }}
                              src={eventInfo?.event?.extendedProps?.avatar}
                            />
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "18px",
                                marginTop: "6px",
                                marginLeft: "4px",
                                color: "primary.main",
                              }}
                            >
                              {eventInfo?.event?.extendedProps.name}
                            </Typography>
                          </Stack>
                          <Typography sx={subEventDayStyles}>
                            {eventInfo?.event?.extendedProps?.position?.name ||
                              "--"}
                          </Typography>
                          <Typography sx={subEventDayStyles}>
                            {eventInfo?.event?.extendedProps.hour}h
                          </Typography>

                          <Stack
                            className="same-time-worker"
                            // sx={{
                            //   visibility: "hidden",
                            //   transition: "all .3s ease-in-out",
                            // }}
                          >
                            {!_.isEmpty(sameTime) &&
                              sameTime[`${eventInfo?.event?.extendedProps?.id}`]
                                ?.length > 0 && (
                                <>
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      lineHeight: "18px",
                                      fontWeight: 400,
                                      color: "#212121",
                                      mb: 1,
                                    }}
                                  >
                                    {timeT(
                                      "myTime.calender_tab.same_time_worker",
                                    )}
                                    :
                                  </Typography>
                                  {sameTime[
                                    `${eventInfo?.event?.extendedProps?.id}`
                                  ]?.map((item, index) => {
                                    return (
                                      <Box
                                        key={index}
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                          mb: 1,
                                        }}
                                      >
                                        <Avatar
                                          sx={{ width: 20, height: 20 }}
                                          src={item?.avatar?.link}
                                        />
                                        <Typography
                                          sx={{
                                            fontSize: "12px",
                                            lineHeight: "16px",
                                            color: "#000",
                                          }}
                                        >
                                          {item.fullname}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                                </>
                              )}
                          </Stack>
                        </Stack>
                      </HtmlTooltip>
                    );
                  return (
                    <HtmlTooltip
                      title={
                        <>
                          <Stack
                            direction="column"
                            sx={{ backgroundColor: "common.white" }}
                            gap={2 / 8}
                          >
                            <Stack direction="row" alignItems="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: "6px",
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: "20px",
                                    height: "20px",
                                    marginTop: "6px",
                                  }}
                                  src={eventInfo?.event?.extendedProps?.avatar}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    lineHeight: "18px",
                                    marginTop: "6px",
                                    marginLeft: "4px",
                                    color: "rgba(246, 78, 96, 1)",
                                  }}
                                >
                                  {eventInfo?.event?.extendedProps.name}
                                </Typography>
                              </Box>
                            </Stack>
                            <Typography sx={subEventDayStyles}>
                              {eventInfo?.event?.extendedProps.position?.name}
                            </Typography>

                            <Typography sx={subEventDayStyles}>
                              {eventInfo?.event?.extendedProps.hour}h
                            </Typography>

                            <Stack
                              className="same-time-worker"
                              sx={{
                                visibility: "hidden",
                                transition: "all .3s ease-in-out",
                              }}
                            >
                              {!_.isEmpty(sameTime) &&
                                sameTime[
                                  `${eventInfo?.event?.extendedProps?.id}`
                                ]?.length > 0 && (
                                  <>
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        lineHeight: "18px",
                                        fontWeight: 400,
                                        color: "#212121",
                                        mb: 1,
                                      }}
                                    >
                                      {timeT(
                                        "myTime.calender_tab.same_time_worker",
                                      )}
                                      :
                                    </Typography>
                                    {sameTime[
                                      `${eventInfo?.event?.extendedProps?.id}`
                                    ]?.map((item, index) => {
                                      return (
                                        <Box
                                          key={index}
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1,
                                          }}
                                        >
                                          <Avatar
                                            sx={{ width: 20, height: 20 }}
                                            src={item?.avatar?.link}
                                          />
                                          <Typography
                                            sx={{
                                              fontSize: "12px",
                                              lineHeight: "16px",
                                              color: "#000",
                                            }}
                                          >
                                            {item.fullname}
                                          </Typography>
                                        </Box>
                                      );
                                    })}
                                  </>
                                )}
                            </Stack>
                          </Stack>
                        </>
                      }
                      sx={{
                        ".MuiTooltip-tooltip": {
                          borderLeftColor: "#F64E60",
                        },
                      }}
                    >
                      <Stack direction="column" sx={boxStyles}>
                        <Stack direction="row" alignItems="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: "6px",
                            }}
                          >
                            <Avatar
                              sx={{
                                width: "20px",
                                height: "20px",
                                marginTop: "6px",
                              }}
                              src={eventInfo?.event?.extendedProps?.avatar}
                            />
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "18px",
                                marginTop: "6px",
                                marginLeft: "4px",
                                color: "rgba(246, 78, 96, 1)",
                              }}
                            >
                              {eventInfo?.event?.extendedProps.name}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography sx={subEventDayStyles}>
                          {eventInfo?.event?.extendedProps.position?.name}
                        </Typography>

                        <Typography sx={subEventDayStyles}>
                          {eventInfo?.event?.extendedProps.hour}h
                        </Typography>

                        <Stack
                          className="same-time-worker"
                          // sx={{
                          //   visibility: "hidden",
                          //   transition: "all .3s ease-in-out",
                          // }}
                        >
                          {!_.isEmpty(sameTime) &&
                            sameTime[`${eventInfo?.event?.extendedProps?.id}`]
                              ?.length > 0 && (
                              <>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    lineHeight: "18px",
                                    fontWeight: 400,
                                    color: "#212121",
                                    mb: 1,
                                  }}
                                >
                                  {timeT(
                                    "myTime.calender_tab.same_time_worker",
                                  )}
                                  :
                                </Typography>
                                {sameTime[
                                  `${eventInfo?.event?.extendedProps?.id}`
                                ]?.map((item, index) => {
                                  return (
                                    <Box
                                      key={index}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 1,
                                      }}
                                    >
                                      <Avatar
                                        sx={{ width: 20, height: 20 }}
                                        src={item?.avatar?.link}
                                      />
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          lineHeight: "16px",
                                          color: "#000",
                                        }}
                                      >
                                        {item.fullname}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              </>
                            )}
                        </Stack>
                      </Stack>
                    </HtmlTooltip>
                  );
                }}
                eventDidMount={(info) => {
                  info.el.addEventListener("contextmenu", (e) => {
                    e.preventDefault();

                    handleOpenEventMenu(e.currentTarget, info.event);
                  });
                }}
                slotLabelContent={(eventInfo: { date: Date }) => {
                  const currentTime = dayjs(eventInfo.date).format("h:mm A");
                  return (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        lineHeight: "18px",
                        fontWeight: 400,
                        color: isDarkMode ? "#fff" : "#666666",
                      }}
                    >
                      {currentTime}
                    </Typography>
                  );
                }}
                viewDidMount={(view) => {
                  const timeGridAxisElement = view.el.querySelector(
                    ".fc-timegrid-axis-frame",
                  );
                  if (timeGridAxisElement)
                    timeGridAxisElement.innerHTML = "Time";
                }}
                //allDayDidMount={(arg) => ""}
              />
              <Menu
                id="basic-menu"
                anchorEl={menuAnchorEl}
                open={open}
                onClose={handleCloseEventMenu}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleDuplicateEvent}>
                  <ListItemIcon>
                    <DuplicateIcon />
                  </ListItemIcon>
                  {commonT("duplicate")}
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        )}
        {activeTab === "dayGridWeek" && (
          <Grid container spacing={1}>
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
                        sx={{ color: isDarkMode ? "#fff" : "common.black" }}
                      >
                        {dayNumber}
                      </Typography>
                    </StyledDay>
                  );
                })}
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: "0px!important" }}>
              <TableContainer
                sx={{
                  // borderLeft: "1px solid rgb(224, 224, 224)",
                  maxHeight: "calc(100vh - 340px)",
                  // paddingTop: "0px!important",
                  overflow: "auto",
                }}
              >
                <Table
                  sx={{
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                    position: "relative",
                    //bottom: "-7px",
                  }}
                  stickyHeader={true}
                >
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>
                        <Box sx={{ minWidth: 100 }}>
                          {timeT("myTime.day_tab.project")}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ minWidth: 100 }}>
                          {timeT("myTime.day_tab.position")}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ minWidth: 100 }}>
                          {timeT("myTime.day_tab.start_time")}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ minWidth: 100 }}>
                          {timeT("myTime.day_tab.time")}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ minWidth: 100 }}>
                          {timeT("myTime.day_tab.note")}
                        </Box>
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
                          <Tooltip
                            key={index}
                            title="Click to view detail"
                            arrow
                          >
                            <StyledTableRow
                              sx={{
                                ...rowStyles,
                                cursor: "pointer",
                              }}
                              key={index}
                              onClick={() => {
                                setIsEdit(true);
                                setSelectedEvent(event);

                                setIsOpenCreatePopup(true);
                              }}
                            >
                              <StyledTableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    maxWidth: 200,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <Avatar sx={{ width: 20, height: 20 }} />
                                  {event?.extendedProps?.project?.name}
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                {event?.extendedProps?.position?.name}
                              </StyledTableCell>
                              <StyledTableCell>
                                {event?.extendedProps?.start_time}
                              </StyledTableCell>
                              <StyledTableCell>
                                {" "}
                                {event?.extendedProps?.hour || 0}h
                              </StyledTableCell>
                              <StyledTableCell>
                                {event?.extendedProps?.note &&
                                event.extendedProps.note.length > 20
                                  ? event.extendedProps.note.slice(0, 20) +
                                    "..."
                                  : event?.extendedProps?.note}
                              </StyledTableCell>
                            </StyledTableRow>
                          </Tooltip>
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
        )}
      </Stack>
      {_renderFooter()}
      {_redderCreatePopup()}
      {/* {_redderUpdatePopup()} */}
    </Stack>
  );
};

export default TrackingCalendar;
