"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  AvatarGroup,
  Box,
  Button,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import PlusFillIcon from "icons/PlusFillIcon";
import Avatar from "@mui/material/Avatar";
import "./style.css";
import { AddCircle, CalendarToday, Group } from "@mui/icons-material";
import CloseIcon from "icons/CloseIcon";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";

interface Timesheet {
  created_time: string;
  day: string;
  duration: number;
  end_time: string;
  _id: string;
  is_pin: boolean;
  note: string;
  fullname: string; // Assuming fullname is added to each timesheet
  avatar: string;
  project: Project;
}

interface Project {
  id: string;
  name: string;
  company: string;
  avatar: string | null; // Example assumes avatar is a string URL or null
}

interface Task {
  avatarUrl: string;
  duration: number;
  taskName: string;
  projectName: string;
}

interface Avatar {
  name: string;
  src: string;
}

interface Event {
  date: string;
  totalTime: number;
  peopleCount: number;
  sheetCount: number;
  avatars: Avatar[];
  tasks: Task[];
}

interface SelectedDate {
  day: Date | null;
  event: Event | null;
}

const MonthCalendarSheetTest = () => {
  const { companyItems: company, onGetCompanyTimeSheet } = useGetMyTimeSheet();
  // State to manage current month\
  const [timeSheetData, setTimeSheetData] = useState<Timesheet[]>([]);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<SelectedDate>({
    day: null,
    event: null,
  });
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
      const firstDayOfMonth = currentMonth.clone().startOf("month");
      const lastDayOfMonth = currentMonth.clone().endOf("month");

      onGetCompanyTimeSheet({
        start_date: firstDayOfMonth.format("YYYY-MM-DD"),
        end_date: lastDayOfMonth.format("YYYY-MM-DD"),
        search_key: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const companyData: any = [...company];
      if (companyData) {
        let allTimesheets = [];

        companyData.forEach((data) => {
          if (data.timesheet && Array.isArray(data.timesheet)) {
            allTimesheets = allTimesheets.concat(
              data.timesheet.map((timesheet) => ({
                ...timesheet,
                fullname: data.fullname,
                avatar: data.avatar?.link,
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

  const calculateTotalHours = (days) => {
    let totalHours = 0;
    days.forEach((day) => {
      const dayDate = moment(day).format("YYYY-MM-DD");
      // Check if the day is within the current month
      const event = events.find((e) => e.date === dayDate);
      if (event) {
        totalHours += event.totalTime;
      }
    });
    return totalHours;
  };

  const handleOpenDrawerEvent = (day) => {
    const selectedEvent = events.find(
      (e) => e.date === moment(day).format("YYYY-MM-DD"),
    );
    setSelectedDate({ day, event: selectedEvent || null });
    handleDrawerOpen();
  };

  const renderMonthDays = () => {
    const daysInMonth = getDaysInMonth(
      currentMonth.year(),
      currentMonth.month() + 1,
    );
    const firstDayOfMonth = moment(daysInMonth[0]);

    const startDayIndex = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const weeks: any = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentWeek: any = [];

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
      <tr key={weekIndex}>
        {week.map((dayObj, dayIndex) => (
          <td
            key={dayIndex}
            style={{
              border: "2px solid #EBEAF2",
              height: "80px",
            }}
          >
            {dayObj ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "5px 11px",
                  cursor: "pointer",
                }}
                onClick={() => handleOpenDrawerEvent(dayObj.day!)}
              >
                {moment(dayObj.day).format("D")}
                {dayObj.event && (
                  <>
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        gap: "5px",
                        position: "relative",
                        right: "7px",
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
                          }}
                        >
                          Total Logged Hours
                        </Typography>
                      </div>
                    </Box>
                    <Box
                      sx={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        right: "7px",
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
                              src={avatar.avatar}
                            />
                          ))}
                        </AvatarGroup>
                      </div>
                    </Box>
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
          </td>
        ))}
        <td
          style={{
            border: "2px solid #EBEAF2",
            padding: "8px",
            textAlign: "center",
            background: "#14B9E5",
          }}
        >
         {calculateTotalHours(week.filter(dayObj => dayObj !== null && dayObj.event).map(dayObj => dayObj.day))}
        </td>
      </tr>
    ));
  };

  return (
    <Stack>
      <Box
        sx={{
          background: "#D9F0FD",
          borderRadius: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "62px",
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
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {weekdaysTableHeader.map((day) => (
              <th
                key={day}
                style={{
                  border: "none",
                  padding: "8px",
                  textAlign: "center",
                  width: "200px",
                  color: "#757383",
                  textTransform: "uppercase",
                }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderMonthDays()}</tbody>
      </table>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: "25%" },
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
                color: "#333333",
                fontWeight: "600",
                fontSize: "16px",
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
              <Button
                sx={{
                  backgroundImage: "linear-gradient(to right,#2AF598,#009EFD)",
                  borderRadius: "100px",
                  color: "white",
                  textTransform: "none",
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
              </div>
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
                      icon={<CalendarToday />}
                      value={selectedDate.event.totalTime}
                      label="Total Logged Hours"
                    />
                    <SummaryBox
                      variant="square"
                      icon={<Group />}
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
          sx={{ fontWeight: "bold", color: "#424242", marginBottom: "4px" }}
        >
          {hours} hrs
        </Typography>
        <Typography variant="body2" sx={{ color: "#757575" }}>
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

export default MonthCalendarSheetTest;
