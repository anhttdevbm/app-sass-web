/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
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
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { calendarStyles } from "./TrackingCalendar.styles";

import interactionPlugin from "@fullcalendar/interaction";
import ListIcon from "@mui/icons-material/List";
import {
  LocalizationProvider,
  MobileDatePicker,
  yearCalendarClasses,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ButtonCalendar from "components/shared/ButtonCalendar";
import CustomizedInputBase from "components/shared/InputSeasrch";
import { NS_COMMON, NS_TIME_TRACKING } from "constant/index";
import useTheme from "hooks/useTheme";
import CalendarIcon from "icons/CalendarIcon";
import PlusIcon from "icons/PlusIcon";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import TimeCreate, {
  TimeCreateValue,
} from "../../TimeTrackingModal/TimeCreate";
import TimeSheet from "./TimeSheet";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import useBreakpoint from "hooks/useBreakpoint";
import DuplicateIcon from "icons/DuplicateIcon";
import { getSameWorker } from "store/timeTracking/actions";
import ListSheet from "./ListSheet";
import FilterCategory from "components/sn-time-tracking/components/FilterCategory";
import DayIcon from "icons/DayIcon";
import { DateSelectArg } from "@fullcalendar/core";
import {
  FullCalendarEventProps,
  FullCalendarExtendedProps,
  IFilter,
  ITimeRangeAction,
} from "components/sn-time-tracking/components/timeTracking.types";
import { inter } from "../CalendarTracking.styles";
import TimeRangeNavigator, {
  TypeNavigator,
} from "components/sn-time-tracking/components/TimeRangeNavigator/TimeRangeNavigator";
import { WorkType } from "store/timeTracking/reducer";

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
  isOpenCreatePopup: boolean;
  setIsOpenCreatePopup: (isOpen: boolean) => void;
  currentKindOfSheet: string;
}

const today = dayjs(); // Ngày hiện tại + 1 ngày (ngày mai)
const startOfWeek = today.startOf("week").add(0, "day"); // Ngày bắt đầu tuần (chủ nhật)
const endOfWeek = today.startOf("week").add(6, "day"); // Ngày kết thúc tuần (thứ 2)\

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

const TrackingCalendar = (props: IProps) => {
  const {
    items: myTime,
    onGetMyTimeSheet,
    onUpdateTimeSheet,
  } = useGetMyTimeSheet();
  const { setIsOpenCreatePopup, currentKindOfSheet, isOpenCreatePopup } = props;
  const { isDarkMode } = useTheme();
  const { onAddSnackbar } = useSnackbar();
  const timeT = useTranslations(NS_TIME_TRACKING);
  const { user: userData } = useAuth();
  const { isSmSmaller } = useBreakpoint();

  const calendarRef = useRef<FullCalendar>(null);
  const [filters, setFilters] = useState<IFilter>(DEFAULT_FILTER);

  const [currentDate, setCurrentDate] = useState<string>(dayjs().toString());
  const [currentYear, setCurrentYear] = useState<string>("");
  const [selectedTimeEntry, setSelectedTimeEntry] = useState<
    TimeCreateValue | undefined
  >(undefined);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("timeSheet");
  const [events, setEvents] = useState<FullCalendarEventProps[]>([]);

  const [sameTime, setSameTime] = useState({});
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | Date>(dayjs());

  const [dateClick, setDateClick] = useState<string>("");

  const [dateRange, setDateRange] = useState<any[]>([]);
  const [totalTime, setTotalTime] = useState({
    todayWorkTime: 0,
    todayBreakTime: 0,
    totalWorkTime: 0,
    totalBreakTime: 0,
  });

  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    if (currentKindOfSheet === "timeSheet") {
      const today = dayjs().format("YYYY-MM-DD");
      // If current my time sheet not include today -> get week data that include today data
      if (!(filters.start_date <= today && filters.end_date >= today)) {
        onGetMyTimeSheet({
          start_date: dayjs(today).startOf("week").format("YYYY-MM-DD"),
          end_date: dayjs(today).endOf("week").format("YYYY-MM-DD"),
          search_key: "",
        });
      }
    } else {
      onGetMyTimeSheet({
        start_date: dayjs(today).startOf("day").format("YYYY-MM-DD"),
        end_date: dayjs(today).endOf("day").format("YYYY-MM-DD"),
        search_key: "",
      });
    }
  }, [currentKindOfSheet]);

  useEffect(() => {
    onGetMyTimeSheet({
      start_date: dayjs(selectedDate).startOf("day").format("YYYY-MM-DD"),
      end_date: dayjs(selectedDate).endOf("day").format("YYYY-MM-DD"),
      search_key: "",
    });
  }, [selectedDate]);

  useEffect(() => {
    const getYear = () => {
      if (dayjs.isDayjs(selectedDate)) {
        return selectedDate.year();
      } else {
        return dayjs(selectedDate).year();
      }
    };
    setCurrentYear(getYear().toString());
  }, [selectedDate, dateRange]);

  useEffect(() => {
    setIsOpenCreatePopup(isOpenCreatePopup);
  }, [isOpenCreatePopup]);

  useEffect(() => {
    _.forEach(myTime, (timesheet) => {
      const idEvent = timesheet?.id;
      getSameWorker({ id: idEvent || "" }).then(async (res) => {
        const cloneObject = _.cloneDeep(sameTime);

        cloneObject[idEvent || ""] = res || [];
        setSameTime((state) => ({ ...state, ...cloneObject }));
      });
    });
  }, [myTime]);

  useEffect(() => {
    if (!_.isEmpty(myTime)) {
      const result: FullCalendarEventProps[] = [];
      let totalWorkTime = 0;
      let totalBreakTime = 0;
      let todayWorkTime = 0;
      let todayBreakTime = 0;
      _.forEach(myTime, (timesheet) => {
        const newEvent: FullCalendarEventProps = {
          title: timesheet?.project?.name,
          start: timesheet?.start_time,
          end: timesheet?.end_time,
          extendedProps: {
            id: timesheet?.id,
            date: timesheet?.day,
            start_time: moment(timesheet?.start_time).format("hh:mm A"),
            project: timesheet?.project,
            avatar: userData?.avatar,
            day: timesheet?.day,
            name: userData?.fullname,
            position: timesheet?.position,
            hour: timesheet?.duration,
            typeDefault: timesheet?.type,
            type:
              timesheet?.type === WorkType.WORK_TIME
                ? "working_time"
                : "break_time",
            note: timesheet?.note,
          },
        };

        if (timesheet.type === "Work time") {
          totalWorkTime += timesheet?.duration || 0;
          if (timesheet.day === dayjs(selectedDate).format("YYYY-MM-DD")) {
            todayWorkTime += timesheet?.duration || 0;
          }
        } else {
          totalBreakTime += timesheet?.duration || 0;
          if (timesheet.day === dayjs(selectedDate).format("YYYY-MM-DD")) {
            todayBreakTime += timesheet?.duration || 0;
          }
        }

        result.push(newEvent);
      });

      setTotalTime({
        todayWorkTime,
        todayBreakTime,
        totalWorkTime,
        totalBreakTime,
      });
      setEvents(result);
    }
  }, [myTime, userData]);

  useEffect(() => {
    if (
      !_.isEmpty(filters) &&
      dayjs(filters?.start_date).isValid() &&
      dayjs(filters?.end_date).isValid()
    ) {
      generateDateRange();
      onGetMyTimeSheet(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // setSelectedEvent(eventData);
    setIsOpenCreatePopup(true);
    handleCloseEventMenu();
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (
      selectInfo.view.type === "timeGridWeek" ||
      selectInfo.view.type === "timeGridDay"
    ) {
      const duration = moment
        .duration(moment(selectInfo.end).diff(moment(selectInfo.start)))
        .hours();

      const timeCreateValue: TimeCreateValue = {
        day: moment(selectInfo.start).format("YYYY-MM-DD"),
        duration,
        start_time: selectInfo.start.toString(),
        id: "",
        note: "",
        position: userData?.position?.id,
        project_id: "",
        type: undefined,
      };

      setIsEdit(true);
      setSelectedTimeEntry(timeCreateValue);
      setIsOpenCreatePopup(true);
    }
  };

  const handleSelectListSheetRow = (selectedRowData: TimeCreateValue) => {
    setIsEdit(true);
    setSelectedTimeEntry(selectedRowData);
    setIsOpenCreatePopup(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const onGoDay = (value: Date) => {
    const calendarApi = calendarRef?.current && calendarRef?.current.getApi();
    calendarApi?.gotoDate(dayjs(value).format("YYYY-MM-DD"));
  };

  const onAction = (params: ITimeRangeAction) => {
    const { action, value } = params;
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
        const previousWeek = dayjs(selectedDate).subtract(1, "week");

        const startDate = previousWeek.startOf("week").format("YYYY-MM-DD");
        const endDate = previousWeek.endOf("week").format("YYYY-MM-DD");

        setFilters({ ...filters, start_date: startDate, end_date: endDate });
        setCurrentDate(previousWeek.startOf("week").toString());
        setSelectedDate(previousWeek.startOf("week"));

        if (calendarApi) {
          calendarApi.prev();
          calendarApi.refetchEvents();
        }
      }
      if (value === "next") {
        const nextWeek = dayjs(selectedDate).add(1, "week");

        const startDate = nextWeek.startOf("week").format("YYYY-MM-DD");
        const endDate = nextWeek.endOf("week").format("YYYY-MM-DD");

        setFilters({ ...filters, start_date: startDate, end_date: endDate });
        setCurrentDate(nextWeek.startOf("week").toString());
        setSelectedDate(nextWeek.startOf("week"));
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
                // onAction({
                //   action:"view",
                //   value:"timeGridWeek"
                // });
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
          {/* <Grid
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
          </Grid> */}
        </Grid>
      </Stack>
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

  const _renderFooter = (type: TypeNavigator) => {
    return (
      <Stack
        direction="column"
        alignItems="center"
        sx={{ marginTop: "15px", color: isDarkMode ? "#fff" : "#212121" }}
      >
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
          {type === TypeNavigator.WEEKLY
            ? timeT("header.tab.weekly_total")
            : "Daily total"}
        </Typography>
        <Stack direction={isSmSmaller ? "column" : "row"}>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                background: "#14B9E5",
              }}
            ></span>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                marginRight: "16px",
              }}
            >
              {timeT("header.tab.workTime")}:{" "}
              {type === TypeNavigator.WEEKLY
                ? totalTime.totalWorkTime
                : totalTime.todayWorkTime}
              h
            </Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                background: "#FF2C56",
              }}
            ></span>
            <Typography sx={{ fontSize: "16px", fontWeight: 400 }}>
              {timeT("header.tab.breakTime")}:{" "}
              {type === TypeNavigator.WEEKLY
                ? totalTime.totalBreakTime
                : totalTime.todayBreakTime}
              h
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  const _renderCreatePopup = () => (
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
      defaultValue={selectedTimeEntry}
      dateClick={dateClick}
    />
  );
  return (
    <Stack
      direction="column"
      height="100%"
      sx={{
        ".fc-toolbar .fc-timeGridWeek-button": {
          display: "none",
        },
        position: "relative",
      }}
    >
      <Stack
        //ref={scrollRef}
        sx={{
          position: "relative",
        }}
        height="100%"
      >
        {/* {_renderCalendarModule()} */}

        {/* {_renderTimeSheetContent()} */}
        {currentKindOfSheet === "timeSheet" && (
          // <TimeSheet data={myTime} filters={filters} dateRange={dateRange} />
          <>
            <div
              style={{
                marginBottom: "20px",
                borderRadius: "100px",
                background: "#F7F7FD",
              }}
            >
              <TimeRangeNavigator
                currentDate={currentDate}
                currentYear={currentYear}
                filters={filters}
                setFilters={setFilters}
                onAction={onAction}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                type={TypeNavigator.DAILY}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                height: "100%",
              }}
            >
              <FilterCategory />
              <ListSheet
                data={myTime}
                handleSelectListSheetRow={handleSelectListSheetRow}
                selectedDate={selectedDate}
              />
            </Box>
            {_renderFooter(TypeNavigator.DAILY)}
          </>
        )}
        {currentKindOfSheet === "table" && (
          <Typography sx={{ textAlign: "center" }}>No data found</Typography>
        )}
        {currentKindOfSheet === "timeGridWeek" && (
          <>
            <div
              style={{
                marginBottom: "20px",
                borderRadius: "100px",
                background: "#F7F7FD",
              }}
            >
              <TimeRangeNavigator
                currentDate={currentDate}
                currentYear={currentYear}
                filters={filters}
                setFilters={setFilters}
                onAction={onAction}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                type={TypeNavigator.WEEKLY}
              />
            </div>
            <Stack
              sx={
                {
                  ...calendarStyles,
                  flexGrow: 1,
                  minHeight: isSmSmaller ? "unset" : 0,
                  minWidth: 0,
                } as SxProps<Theme>
              }
              className={`view-timeGridWeek`}
            >
              <Box
                sx={{
                  height: "100%",
                  ".fc-timegrid-slot-label-cushion": {
                    padding: "0 8px",
                    minHeight: "36px",
                    display: "flex",
                  },
                  ".fc-day.fc-day-sun, .fc-day.fc-day-sat, .fc-timegrid-axis, colgroup":
                    {
                      backgroundColor: isDarkMode
                        ? "rgb(86, 86, 86)"
                        : "#FAFAFA",
                      ...(isDarkMode && {
                        color: "#fff",
                      }),
                    },
                  ".fc-timegrid-axis .fc-timegrid-axis-frame": {
                    color: isDarkMode ? "#fff" : undefined,
                  },
                  "colgroup, colgroup col": {
                    width: isSmSmaller ? "62px !important" : "112px !important",
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
                          ? WorkType.WORK_TIME
                          : WorkType.BREAK_TIME,
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
                    const { extendedProps } = eventInfo.event;
                    const timeCreateValue: TimeCreateValue = {
                      day: extendedProps.day,
                      duration: extendedProps.hour,
                      start_time: eventInfo.event.start?.toString(),
                      id: extendedProps.id,
                      note: extendedProps.note,
                      position: extendedProps.position?.id,
                      project_id: extendedProps.project?.id,
                      type: extendedProps.typeDefault,
                    };

                    setIsEdit(true);
                    setSelectedTimeEntry(timeCreateValue);
                    setIsOpenCreatePopup(true);
                  }}
                  initialView={"timeGridWeek"}
                  initialDate={dayjs(selectedDate).format("YYYY-MM-DD")}
                  weekends={true}
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
                    const dayOfWeek = eventInfo.text.split(" ").shift();

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
                    const extendedProps: FullCalendarExtendedProps = eventInfo
                      ?.event.extendedProps as FullCalendarExtendedProps;
                    const type = extendedProps.type;
                    const styles =
                      eventStyles[type as "working_time" | "break_time"];
                    const boxStyles = {
                      position: "relative",
                      ...styles,
                      height: "100%",
                      padding: extendedProps.hour === 1 ? "0 6px" : "6px",
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
                                    src={extendedProps?.avatar}
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
                                    {extendedProps.name}
                                  </Typography>
                                </Stack>
                                <Typography sx={subEventDayStyles}>
                                  {extendedProps.project?.name || "--"}
                                </Typography>
                                <Typography sx={subEventDayStyles}>
                                  {extendedProps.hour}h
                                </Typography>

                                <Stack
                                  className="same-time-worker"
                                  // sx={{
                                  //   visibility: "hidden",
                                  //   transition: "all .3s ease-in-out",
                                  // }}
                                >
                                  {!_.isEmpty(sameTime) &&
                                    sameTime[`${extendedProps?.id}`]?.length >
                                      0 && (
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
                                        {sameTime[`${extendedProps?.id}`]?.map(
                                          (item, index) => {
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
                                          },
                                        )}
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
                            {/* <Stack direction="row" alignItems="center">
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
                            </Stack> */}
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: extendedProps?.project?.name
                                  ? "#0575E6"
                                  : "#F64E60",
                                fontFamily: inter.style.fontFamily,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: extendedProps.hour,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {extendedProps?.project?.name || "Break time"}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: "#212121",
                                fontFamily: inter.style.fontFamily,
                                fontWeight: 500,
                              }}
                            >
                              {extendedProps.hour}h
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
                                    src={
                                      eventInfo?.event?.extendedProps?.avatar
                                    }
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
                          {/* Employee Info */}
                          {/* <Stack direction="row" alignItems="center">
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
                                src={extendedProps.avatar}
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
                                {extendedProps.name}
                              </Typography>
                            </Box>
                          </Stack> */}

                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: extendedProps?.project?.name
                                ? "#0575E6"
                                : "#F64E60",
                              fontFamily: inter.style.fontFamily,
                            }}
                          >
                            {extendedProps?.project?.name || "Break time"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#212121",
                              fontFamily: inter.style.fontFamily,
                              fontWeight: 500,
                            }}
                          >
                            {extendedProps.hour}h
                          </Typography>

                          <Stack
                            className="same-time-worker"
                            // sx={{
                            //   visibility: "hidden",
                            //   transition: "all .3s ease-in-out",
                            // }}
                          >
                            {!_.isEmpty(sameTime) &&
                              sameTime[`${extendedProps.id}`]?.length > 0 && (
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
                                  {sameTime[`${extendedProps.id}`]?.map(
                                    (item, index) => {
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
                                    },
                                  )}
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
            {_renderFooter(TypeNavigator.WEEKLY)}
          </>
        )}
      </Stack>
      {_renderCreatePopup()}
    </Stack>
  );
};

export default TrackingCalendar;
