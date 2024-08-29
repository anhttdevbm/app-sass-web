/* eslint-disable react-hooks/exhaustive-deps */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Person } from "@mui/icons-material";
import ListIcon from "@mui/icons-material/List";
import { styled } from "@mui/system";
import ButtonCalendar from "components/shared/ButtonCalendar";
import FilterCategory from "components/sn-time-tracking/components/FilterCategory";
import TimeRangeNavigator, {
  TypeNavigator,
} from "components/sn-time-tracking/components/TimeRangeNavigator/TimeRangeNavigator";
import { ITimeRangeAction } from "components/sn-time-tracking/components/timeTracking.types";
import { NS_TIME_TRACKING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { RootState } from "store/configureStore";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import { setIsOpen as setUserNavigationVisible } from "store/userNavigationDetail/reducer";
import TimeCreate from "../../TimeTrackingModal/TimeCreate";
import ListSheet from "./ListSheet";
import MonthCalendarSheet from "./MonthCalendarSheet";
import TableSheet from "./TableSheet";
import useGetEmployeeOptions from "components/sn-sales/hooks/useGetEmployeeOptions";

interface IProps {
  events: any[];
  onClick(action: "create" | "edit", item?: any): void;
  isOpenCreatePopup: boolean;
  currentKindOfSheet: string;
  setIsOpenCreatePopup: (isOpen: boolean) => void;
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

const TrackingCalendar: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const {
    isOpen: userDetailTablevisible,
    username: userDetailTableName,
    avatar: userDetailTableAvatar,
  } = useSelector((state: RootState) => state.userNavigationDetail);
  const { currentKindOfSheet, isOpenCreatePopup, setIsOpenCreatePopup } = props;
  const [currentYear, setCurrentYear] = useState<string>("");
  const isGetLoading: any = false;
  const timeT = useTranslations(NS_TIME_TRACKING);
  const { isSmSmaller } = useBreakpoint();
  const { isDarkMode } = useTheme();
  const { companyItems: company, onGetCompanyTimeSheet } = useGetMyTimeSheet();

  const [isOpen, setIsOpen] = React.useState(false);
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
    todayWorkTime: 0,
    todayBreakTime: 0,
    totalWorkTime: 0,
    totalBreakTime: 0,
  });

  useEffect(() => {
    if (currentKindOfSheet === "timeSheet") {
      const today = dayjs().format("YYYY-MM-DD");
      // If current my time sheet not include today -> get week data that include today data
      if (!(filters.start_date <= today && filters.end_date >= today)) {
        onGetCompanyTimeSheet({
          start_date: dayjs(today).startOf("week").format("YYYY-MM-DD"),
          end_date: dayjs(today).endOf("week").format("YYYY-MM-DD"),
          search_key: "",
        });
      }
    } else {
      onGetCompanyTimeSheet(filters);
    }
  }, [currentKindOfSheet]);

  useEffect(() => {
    const getYear = () => {
      if (dayjs.isDayjs(selectedDate)) {
        return selectedDate.year();
      } else {
        return dayjs(selectedDate).year(); // Convert Date to dayjs and get year
      }
    };
    setCurrentYear(getYear().toString());
  }, [selectedDate, dateRange]);

  useEffect(() => {
    setIsOpenCreatePopup(isOpenCreatePopup);
  }, [isOpenCreatePopup]);

  useEffect(() => {
    if (!_.isEmpty(company)) {
      const result: any[] = [];
      const today = dayjs().format("YYYY-MM-DD");
      let totalWorkTime = 0;
      let totalBreakTime = 0;
      let todayWorkTime = 0;
      let todayBreakTime = 0;
      _.forEach(company, (user) => {
        if (user && user?.timesheet) {
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
              if (data.type === "Work time") {
                totalWorkTime += data?.duration || 0;
                if (dayjs(data.day).format("YYYY-MM-DD") === today) {
                  todayWorkTime += data?.duration || 0;
                }
              } else {
                totalBreakTime += data?.duration || 0;
                if (dayjs(data.day).format("YYYY-MM-DD") === today) {
                  todayBreakTime += data?.duration || 0;
                }
              }
              result.push(newEvent);
            }
          });
        }
      });
      setTotalTime({
        todayBreakTime,
        todayWorkTime,
        totalBreakTime,
        totalWorkTime,
      });
      setEvents(result);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  useEffect(() => {
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

  const onAction = (params: ITimeRangeAction) => {
    const { action, value } = params;
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
  //   return (
  //     <>
  //       <Grid
  //         // container
  //         // rowSpacing={1}
  //         sx={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "space-between",
  //           padding: "0 20px",
  //         }}
  //       >
  //         <p>Year: {currentYear}</p>
  //         <Grid
  //           item
  //           sm={12}
  //           md={4}
  //           // sx={{
  //           //   display: "flex",
  //           //   alignItems: "center",
  //           //   justifyContent: "center",
  //           //   order: 2,
  //           // }}
  //         >
  //           <LocalizationProvider dateAdapter={AdapterDayjs}>
  //             <MobileDatePicker
  //               open={isOpen}
  //               onOpen={() => setIsOpen(true)}
  //               onClose={() => setIsOpen(false)}
  //               onChange={(date: any) => {
  //                 if (date) {
  //                   const { startDate, endDate } =
  //                     getWeekStartAndEndDates(date);
  //                   setSelectedDate(date);
  //                   // onGoDay(date);
  //                   setFilters({
  //                     ...filters,
  //                     start_date: startDate,
  //                     end_date: endDate,
  //                   });
  //                 }
  //               }}
  //               closeOnSelect
  //               sx={{ display: "none" }}
  //               slotProps={{
  //                 actionBar: {
  //                   actions: [],
  //                 },
  //                 toolbar: {
  //                   hidden: true,
  //                 },
  //                 day: {
  //                   sx: {
  //                     transition: "all ease 0.25s",
  //                     borderRadius: "4px",
  //                     fontWeight: 600,
  //                     "&.Mui-selected": {
  //                       color: "#ffffff",
  //                       backgroundColor: `rgba(54, 153, 255, 1) !important`,
  //                       "&.MuiPickersDay-today": {
  //                         color: "#ffffff",
  //                         borderColor: "rgba(54, 153, 255, 1)",
  //                       },
  //                     },
  //                     "&.MuiPickersDay-today": {
  //                       color: "rgba(54, 153, 255, 1)",
  //                       borderColor: "rgba(54, 153, 255, 1)",
  //                     },
  //                     ":hover": {
  //                       background: "rgba(54, 153, 255, 1)",
  //                     },
  //                   },
  //                 },
  //               }}
  //             />
  //           </LocalizationProvider>

  //           <Stack
  //             direction="row"
  //             alignItems="center"
  //             sx={{
  //               ":hover": {
  //                 cursor: "pointer",
  //               },
  //             }}
  //           >
  //             <Button
  //               sx={{
  //                 minWidth: "28px",
  //                 height: "28px",
  //                 padding: 0,
  //                 // borderRadius: "4px 0px 0px 4px",
  //                 // backgroundColor: "grey.100",
  //                 color: "#212529",
  //               }}
  //               onClick={() => onAction("week", "prev")}
  //             >
  //               <ChevronLeftIcon />
  //             </Button>
  //             <div onClick={() => setIsOpen(true)}>
  //               <Typography
  //                 sx={{
  //                   fontSize: "16px",
  //                   color: "neutral.800",
  //                   margin: "0 10px",
  //                   fontFamily: "unset",
  //                   padding: "0 10px",
  //                 }}
  //               >
  //                 {`${moment(filters?.start_date).format("MMMM D")} - ${dayjs(
  //                   filters?.end_date,
  //                 ).format("MMMM D")}`}
  //               </Typography>
  //             </div>
  //             <Button
  //               sx={{
  //                 minWidth: "28px",
  //                 height: "28px",
  //                 padding: 0,
  //                 // borderRadius: "0px 4px 4px 0px",
  //                 // backgroundColor: "grey.100",
  //                 color: "#212529",
  //               }}
  //               onClick={() => onAction("week", "next")}
  //             >
  //               <ChevronRightIcon />
  //             </Button>
  //           </Stack>
  //         </Grid>
  //         <Grid item sm={12} md={4} sx={{ order: isSmSmaller ? 1 : 3 }}>
  //           <Stack
  //             direction="row"
  //             alignItems="center"
  //             justifyContent="flex-end"
  //             sx={{ gap: "3px" }}
  //           >
  //             <Button
  //               sx={{
  //                 minWidth: "28px",
  //                 height: "28px",
  //                 padding: 0,
  //                 // borderRadius: "4px 0px 0px 4px",
  //                 // backgroundColor: "grey.100",
  //                 color: "#212529",
  //               }}
  //               onClick={() => onAction("week", "prev")}
  //             >
  //               <ChevronLeftIcon />
  //             </Button>
  //             <Button
  //               sx={{
  //                 width: "97px",
  //                 height: "30px",
  //                 padding: "4px",
  //                 color: "neutral.800",
  //                 textAlign: "center",
  //                 textTransform: "capitalize",
  //                 "&:hover": {
  //                   backgroundColor: "#D9F0FD",
  //                 },
  //               }}
  //               onClick={() => onAction("week", "today")}
  //               disabled={
  //                 dayjs(currentDate).format("YYYY-MM-DD") ===
  //                 dayjs().format("YYYY-MM-DD")
  //               }
  //             >
  //               {timeT("company_time.this_week")}
  //             </Button>
  //             <Button
  //               sx={{
  //                 minWidth: "28px",
  //                 height: "28px",
  //                 padding: 0,
  //                 // borderRadius: "0px 4px 4px 0px",
  //                 // backgroundColor: "grey.100",
  //                 color: "#212529",
  //               }}
  //               onClick={() => onAction("week", "next")}
  //             >
  //               <ChevronRightIcon />
  //             </Button>
  //           </Stack>
  //         </Grid>
  //       </Grid>
  //       {/* {_renderCalendarModule()} */}
  //     </>
  //   );
  // };

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
        <Stack direction="row">
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
      onClose={() => setIsOpenCreatePopup(false)}
      filters={filters}
      currentScreen="companyTime"
    />
  );

  return (
    <Stack direction="column" height="100%" paddingTop="20px">
      {currentKindOfSheet === "table" && (
        <>
          {userDetailTablevisible && (
            <div
              style={{
                margin: "20px 0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <IconButton
                onClick={() => dispatch(setUserNavigationVisible(false))}
              >
                <ChevronLeftIcon />
              </IconButton>
              {userDetailTableAvatar ? (
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                  src={userDetailTableAvatar}
                />
              ) : (
                <Avatar sx={{ width: 40, height: 40 }}>
                  <Person />
                </Avatar>
              )}

              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "20px",
                  fontFamily: "unset",
                }}
              >
                {userDetailTableName}
              </Typography>
            </div>
          )}
        </>
      )}
      {currentKindOfSheet === "table" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "100%",
          }}
        >
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
          <FilterCategory periodVisibleFilter={false} />
          <TableSheet dateRange={dateRange} data={company} />
        </Box>
      ) : (
        <Box
          sx={{
            height: "100%",
          }}
        >
          {currentKindOfSheet === "timeGridWeek" && (
            <Box
              sx={{
                marginTop: "10px",
                height: "100%",
              }}
            >
              <MonthCalendarSheet />
            </Box>
          )}
          {currentKindOfSheet === "timeSheet" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                height: "100%",
              }}
            >
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
              <FilterCategory />
              <ListSheet data={company} />

              {_renderFooter(TypeNavigator.DAILY)}
            </Box>
          )}
        </Box>
      )}
      {_renderCreatePopup()}
    </Stack>
  );
};

export default TrackingCalendar;
