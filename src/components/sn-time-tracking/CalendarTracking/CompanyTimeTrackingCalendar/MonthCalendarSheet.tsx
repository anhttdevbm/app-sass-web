"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AvatarGroup,
  Box,
  Drawer,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";
import useBreakpoint from "hooks/useBreakpoint";
import { CalendarTickIcon } from "icons/CalendarTickIcon";
import CloseIcon from "icons/CloseIcon";
import { GroupUserIcon } from "icons/GroupUserIcon";
import moment from "moment";
import { useEffect, useState } from "react";
import { MyTimeSheet } from "store/timeTracking/reducer";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import { inter } from "../CalendarTracking.styles";
import "./style.css";

interface Timesheet extends MyTimeSheet {
  fullname: string;
  avatar: string;
  // Override day in MyTimeSheet to make it is require field
  day: string;
}

// interface Project {
//   id: string;
//   name: string;
//   company: string;
//   avatar: string | null; // Example assumes avatar is a string URL or null
// }

interface Task {
  avatarUrl: string;
  duration: number;
  taskName: string;
  projectName: string;
}

interface IAvatar {
  name: string;
  src: string;
}

interface Event {
  date: string;
  totalTime: number;
  peopleCount: number;
  sheetCount: number;
  avatars: IAvatar[];
  tasks: Task[];
}

interface SelectedDate {
  day: Date | null;
  event: Event | undefined;
}

const TODAY_DATE = moment().format("D");

const MonthCalendarSheet = () => {
  const { companyItems: company, onGetCompanyTimeSheet } = useGetMyTimeSheet();
  // State to manage current month\
  const [timeSheetData, setTimeSheetData] = useState<Timesheet[]>([]);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<SelectedDate>({
    day: null,
    event: undefined,
  });

  const { isXlBigger } = useBreakpoint();
  const weekdaysTableHeader = [...moment.weekdays(), "Total"];
  const [events, setEvents] = useState<Event[]>([
    {
      date: "2024-07-01",
      totalTime: 8,
      peopleCount: 5,
      avatars: [
        { name: "Alice", src: "https://via.placeholder.com/150" },
        { name: "Bob", src: "https://via.placeholder.com/150" },
        { name: "Charlie", src: "https://via.placeholder.com/150" },
        { name: "Dave", src: "https://via.placeholder.com/150" },
        { name: "Eve", src: "https://via.placeholder.com/150" },
      ],
      tasks: [
        {
          avatarUrl: "https://via.placeholder.com/40", // Replace with actual URL
          duration: 6,
          taskName: "Task 1",
          projectName: "Project test 01",
        },
        {
          avatarUrl: "https://via.placeholder.com/40", // Replace with actual URL
          duration: 5,
          taskName: "Task 1",
          projectName: "Project test 01",
        },
      ],
      sheetCount: 5,
    },
    {
      date: "2024-07-13",
      totalTime: 8,
      peopleCount: 5,
      avatars: [
        { name: "Alice", src: "https://via.placeholder.com/150" },
        { name: "Bob", src: "https://via.placeholder.com/150" },
        { name: "Charlie", src: "https://via.placeholder.com/150" },
        { name: "Dave", src: "https://via.placeholder.com/150" },
        { name: "Eve", src: "https://via.placeholder.com/150" },
      ],
      tasks: [
        {
          avatarUrl: "https://via.placeholder.com/40", // Replace with actual URL
          duration: 6,
          taskName: "Task 1",
          projectName: "Project test 01",
        },
        {
          avatarUrl: "https://via.placeholder.com/40", // Replace with actual URL
          duration: 5,
          taskName: "Task 1",
          projectName: "Project test 01",
        },
      ],
      sheetCount: 5,
    },
    // Add more events here
  ]);

  // Function to get days in a given month
  const getDaysInMonth = (year, month) => {
    const daysArray: Date[] = [];
    const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(new Date(year, month - 1, day)); // month - 1 because months are 0-indexed in JavaScript Date objects
    }
    return daysArray;
  };
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  // Effect to log monthData whenever currentMonth changes
  useEffect(() => {
    const getCompanyTimeSheet = async () => {
      // const firstDayOfMonth = currentMonth.clone().startOf("month");
      // const lastDayOfMonth = currentMonth.clone().endOf("month");

      // await onGetCompanyTimeSheet({
      //   start_date: firstDayOfMonth.format("YYYY-MM-DD"),
      //   end_date: lastDayOfMonth.format("YYYY-MM-DD"),
      //   search_key: "",
      // });
      if (company) {
        const allTimesheets: Timesheet[] = [];
        company.forEach((data) => {
          if (data.timesheet && Array.isArray(data.timesheet)) {
            allTimesheets.push(
              ...data.timesheet.map((timesheet) => ({
                ...timesheet,
                fullname: data.fullname,
                avatar: data.avatar?.link,
                day: timesheet.day as string,
              })),
            );
          }
        });

        setTimeSheetData(allTimesheets);
      }
    };
    getCompanyTimeSheet();
  }, [company]);

  useEffect(() => {
    const aggregatedData = {};

    // Process each timesheet entry
    timeSheetData.forEach((entry) => {
      const { day, duration, fullname, avatar, project } = entry;

      if (!aggregatedData[day]) {
        // Initialize entry if it doesn't exist
        aggregatedData[day] = {
          date: day,
          totalTime: duration,
          peopleCount: 1,
          avatars: [{ name: fullname, src: avatar }],
          tasks: [
            {
              avatarUrl: avatar, // Use avatar URL here if available
              duration: duration,
              taskName: entry.note,
              projectName: project ? project.name : "",
            },
          ],
          sheetCount: 1,
        };
      } else {
        // Update existing entry if day already exists
        aggregatedData[day].totalTime += duration;
        aggregatedData[day].peopleCount += 1;
        aggregatedData[day].avatars.push({ name: fullname, src: avatar });
        aggregatedData[day].tasks.push({
          avatarUrl: avatar, // Use avatar URL here if available
          duration: duration,
          taskName: entry.note,
          projectName: project ? project.name : "",
        });
        aggregatedData[day].sheetCount += 1;
      }
    });
    // Convert aggregatedData object into an array of events
    setEvents(Object.values(aggregatedData));
  }, [timeSheetData]);

  // Function to handle next month navigation
  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  // Function to handle previous month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  const calculateTotalHours = (week: (SelectedDate | null)[]) => {
    const totalHours = week.reduce((pre, cur) => {
      if (cur && cur.event) {
        return pre + cur.event.totalTime;
      }
      return pre;
    }, 0);

    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    return formattedTime;
  };

  const handleOpenDrawerEvent = (day: Date) => {
    const selectedEvent = events.find(
      (e) => e.date === moment(day).format("YYYY-MM-DD"),
    );
    setSelectedDate({ day, event: selectedEvent || undefined });
    handleDrawerOpen();
  };

  const renderMonthDays = () => {
    const daysInMonth = getDaysInMonth(
      currentMonth.year(),
      currentMonth.month() + 1,
    );
    const firstDayOfMonth = moment(daysInMonth[0]);

    const startDayIndex = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
    const weeks: (SelectedDate | null)[][] = [];
    let currentWeek: (SelectedDate | null)[] = [];

    // Push empty cells for days before the start of the month
    for (let i = 0; i < startDayIndex; i++) {
      currentWeek.push(null);
    }

    daysInMonth.forEach((day, index) => {
      const dayDate = moment(day);
      const event = events.find((e) => e.date === dayDate.format("YYYY-MM-DD"));
      currentWeek.push({ day, event });

      // If it's the last day of the week or the last day of the month, push the current week to weeks and start a new week
      if (dayDate.day() === 6 || index === daysInMonth.length - 1) {
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    if (weeks[weeks.length - 1].length < 7) {
      while (weeks[weeks.length - 1].length < 7) {
        weeks[weeks.length - 1].push(null);
      }
    }

    return weeks.map((week, weekIndex) => (
      <TableRow key={weekIndex}>
        {week.map((dayObj, dayIndex) => {
          return (
            <TableCell
              key={dayIndex}
              style={{
                border: "2px solid #EBEAF2",
                height: isXlBigger ? "100px" : "80px",
                padding: 0,
              }}
            >
              {dayObj ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    dayObj.day ? handleOpenDrawerEvent(dayObj.day) : undefined
                  }
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: inter.style.fontFamily,
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      ...(moment(dayObj.day).format("D") === TODAY_DATE
                        ? {
                            backgroundColor: "#0575E6",
                            color: "#FFF",
                            fontWeight: "600",
                          }
                        : {
                            backgroundColor: "transparent",
                            color: "#212529",
                            fontWeight: "400",
                          }),
                    }}
                  >
                    {moment(dayObj.day).format("D")}
                  </Typography>
                  {dayObj.event && (
                    <>
                      {" "}
                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            background: "#EBEAF2",
                            height: "auto",
                            width: "3px",
                            border: "1px solid #EBEAF2",
                          }}
                        ></div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#21263C",
                              fontWeight: "600",
                              lineHeight: "1.4",
                              fontSize: "14px",
                              fontFamily: inter.style.fontFamily,
                            }}
                          >
                            {moment()
                              .startOf("day")
                              .add(dayObj.event.totalTime, "hours")
                              .format("HH:mm")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#4C526C",
                              fontFamily: inter.style.fontFamily,
                            }}
                          >
                            Total Logged Hours
                          </Typography>
                        </div>
                      </Box>
                      {isXlBigger && (
                        <Box
                          sx={{
                            marginTop: "4px",
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "2px",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: "#212529",
                                fontFamily: inter.style.fontFamily,
                              }}
                            >
                              {dayObj.event.sheetCount} <span>Timesheets</span>
                            </Typography>
                            <ChevronRightIcon
                              sx={{ width: 20, height: 20, color: "#408DFB" }}
                            />
                          </div>
                          <div>
                            <AvatarGroup max={4}>
                              {dayObj.event.avatars.map((avatar, index) => (
                                <Avatar
                                  key={index}
                                  sx={{
                                    width: 15, // Adjust the width to make it smaller
                                    height: 15, // Adjust the height to make it smaller
                                    fontSize: 10, // Adjust the font size to make initials smaller
                                  }}
                                  src={avatar.src}
                                />
                              ))}
                            </AvatarGroup>
                          </div>
                        </Box>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#14B9E5",
                  }}
                >
                  {" "}
                </div>
              )}
            </TableCell>
          );
        })}
        <TableCell
          style={{
            border: "2px solid #EBEAF2",
            padding: "8px",
            textAlign: "center",
            background: "#14B9E5",
            fontFamily: inter.style.fontFamily,
            color: "#FFF",
            fontWeight: 700,
          }}
        >
          {week && calculateTotalHours(week)}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <Box
        sx={{
          background: "#D9F0FD",
          borderRadius: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "56px",
          marginBottom: "20px",
        }}
      >
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          sx={{ color: "#0575E6", fontWeight: "700", fontSize: "17px" }}
        >
          {currentMonth.format("MMM YYYY")}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          overflowX: "auto",
        }}
      >
        <TableContainer style={{ width: "100%" }}>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                {weekdaysTableHeader.map((day) => (
                  <TableCell
                    key={day}
                    sx={{
                      border: "none",
                      textAlign: "center",
                      color: "#757383",
                      textTransform: "uppercase",
                      backgroundColor: "transparent",
                      fontFamily: inter.style.fontFamily,
                      fontWeight: 600,
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <tbody>{renderMonthDays()}</tbody>
          </Table>
        </TableContainer>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: "30%" },
        }}
      >
        <Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 20px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "neutral.800",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: inter.style.fontFamily,
              }}
            >
              {moment(selectedDate.day).format("DD MMM YYYY")}
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* <Button
                sx={{
                  backgroundImage: "linear-gradient(to right,#2AF598,#009EFD)",
                  borderRadius: "100px",
                  color: "white",
                  textTransform: "none",
                  border: "none",
                }}
                variant="outlined"
                startIcon={<AddCircle style={{ color: "white" }} />}
              >
                Add new
              </Button>
              <div
                style={{
                  display: "flex",
                }}
              >
                <ChevronLeftIcon
                  style={{
                    background: "#F5F5F5",
                    border: "1px solid #DDDDDD",
                    cursor: "pointer",
                    borderTopLeftRadius: "6px",
                    borderBottomLeftRadius: "6px",
                    width: "30px",
                    height: "30px",
                  }}
                />
                <ChevronRightIcon
                  style={{
                    background: "#F5F5F5",
                    border: "1px solid #DDDDDD",
                    cursor: "pointer",
                    borderTopRightRadius: "6px",
                    borderBottomRightRadius: "6px",
                    width: "30px",
                    height: "30px",
                  }}
                />
              </div> */}
              <IconButton
                onClick={handleDrawerClose}
                style={{
                  color: "#FE4242",
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </Box>
          <Box
            sx={{
              marginTop: "15px",
            }}
          >
            {selectedDate && selectedDate.event ? (
              <>
                {" "}
                <Box sx={{ padding: "20px", background: "#F2FAFF" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0",
                      gap: "20px",
                    }}
                  >
                    <SummaryBox
                      variant="square"
                      icon={<CalendarTickIcon />}
                      value={selectedDate.event.totalTime}
                      label="Total Logged Hours"
                    />
                    <SummaryBox
                      variant="square"
                      icon={<GroupUserIcon />}
                      value={selectedDate.event.peopleCount}
                      label="Total Users"
                    />
                  </Box>
                </Box>
                <Box sx={{ padding: "0 20px" }}>
                  {selectedDate.event.tasks.map((task, index) => (
                    <TaskItem
                      key={index}
                      avatarUrl={task.avatarUrl}
                      hours={task.duration}
                      taskName={task.taskName}
                      projectName={task.projectName}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <Box sx={{ padding: "20px" }}>
                <Typography>No events scheduled for this day.</Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Drawer>
    </Stack>
  );
};

const TaskItem = ({ avatarUrl, hours, taskName, projectName }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #E0E0E0",
        padding: "8px 0",
      }}
    >
      <Avatar
        src={avatarUrl}
        sx={{
          width: 40,
          height: 40,
          marginRight: "16px",
        }}
      />
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "700",
            color: "neutral.800",
            marginBottom: "4px",
            fontFamily: inter.style.fontFamily,
          }}
        >
          {formatHoursToHHMM(hours)} hrs
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "neutral.400",
            fontWeight: "700",
            fontFamily: inter.style.fontFamily,
          }}
        >
          {taskName} • {projectName}
        </Typography>
      </Box>
    </Box>
  );
};

const SummaryBox = ({
  icon: IconComponent,
  value,
  label,
  variant: AvatarVariant,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Avatar
        variant={AvatarVariant}
        sx={{
          borderRadius: "10px",
          backgroundColor: "#fff",
          color: "#757575",
          width: 40,
          height: 40,
          marginRight: "12px",
        }}
      >
        {IconComponent}
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "bold" }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#757575" }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default MonthCalendarSheet;
