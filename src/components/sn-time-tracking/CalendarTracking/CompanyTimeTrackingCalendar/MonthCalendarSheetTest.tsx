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
import "./style.css"

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
}

interface SelectedDate {
  day: Date | null;
  event: Event | null;
}

const MonthCalendarSheetTest = () => {
  // State to manage current month
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
    const monthData = getDaysInMonth(
      currentMonth.year(),
      currentMonth.month() + 1,
    );
    console.log(monthData);
  }, [currentMonth]);

  // Function to handle next month navigation
  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  // Function to handle previous month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  const calculateTotalHours = (weekStart, days) => {
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

    // Determine the starting index based on the weekday of the first day of the month
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
                        justifyContent:"space-between",
                        width:"100%"
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
                        <ChevronRightIcon sx={{ width: 20, height: 20,color:"#408DFB" }} />
                      </div>
                      <div>
                        <AvatarGroup max={4}>
                          {dayObj.event.avatars.map((avatar, index) => (
                            <>
                              <Avatar
                                sx={{
                                  width: 15, // Adjust the width to make it smaller
                                  height: 15, // Adjust the height to make it smaller
                                  fontSize: 10, // Adjust the font size to make initials smaller
                                }}
                              >
                                {avatar.name}
                              </Avatar>
                            </>
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
          {weeks[weekIndex][0] && weeks[weekIndex][0].day
            ? calculateTotalHours(
                moment(weeks[weekIndex][0].day),
                week.map((dayObj) => dayObj?.day),
              )
            : 0}
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
            <div>
              <Button
                sx={{
                  borderRadius: "100px",
                }}
                variant="outlined"
                startIcon={
                  <PlusFillIcon
                    sx={{
                      borderRadius: "100%",
                    }}
                  />
                }
              >
                Add new
              </Button>
            </div>
            <Box>
              {selectedDate && selectedDate.event && (
                <Box sx={{ padding: "20px" }}>
                  <Typography>
                    Total Time: {selectedDate.event.totalTime} hrs
                  </Typography>
                  <Typography>
                    People: {selectedDate.event.peopleCount}
                  </Typography>
                  <Typography>
                    Sheets: {selectedDate.event.sheetCount}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default MonthCalendarSheetTest;
