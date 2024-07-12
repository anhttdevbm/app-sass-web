"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import PlusFillIcon from "icons/PlusFillIcon";

const MonthCalendarSheetTest = () => {
  // State to manage current month
  const [currentMonth, setCurrentMonth] = useState(
    moment("2024-07", "YYYY-MM"),
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const weekdaysTableHeader = [...moment.weekdays(), "Total"];

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
      const dayDate = moment(day);
      // Check if the day is within the current month
      if (dayDate.month() === currentMonth.month()) {
        if (
          dayDate.isSameOrAfter(weekStart) &&
          dayDate.isBefore(weekStart.clone().add(7, "days"))
        ) {
          // Calculate total hours for the day (your logic here)
          // For demonstration, let's assume each day has 8 hours
          totalHours += 8;
        }
      }
    });
    return totalHours;
  };

  const handleOpenDrawerEvent = (day) => {
    setSelectedDate(day);
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
      currentWeek.push(day);

      // If it's the last day of the week or the last day of the month, push the current week to weeks and start a new week
      if (dayDate.day() === 6 || index === daysInMonth.length - 1) {
        // Fill remaining days of the week with empty cells for Thu, Fri, Sat
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks.map((week, weekIndex) => (
      <tr key={weekIndex}>
        {week.map((day, dayIndex) => (
          <td
            key={dayIndex}
            style={{
              border: "2px solid #EBEAF2",
              height: "80px",
            }}
          >
            {day !== null ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "5px 11px",
                  cursor: "pointer",
                }}
                onClick={() => handleOpenDrawerEvent(day)}
              >
                {moment(day).format("D")}
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
          {/* Calculate and display total hours for the week */}
          {calculateTotalHours(moment(weeks[weekIndex][0]), week)}
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
            <Typography variant="body2" sx={{
              color: "#333333",
              fontWeight: "600",
              fontSize: "16px",
            }}>
              {selectedDate && moment(selectedDate).format("DD MMM YYYY")}
            </Typography>
            <div>
              <Button sx={{
                borderRadius:"100px"
              }} variant="outlined" startIcon={<PlusFillIcon sx={{
                borderRadius:"100%"
              }} />}>
                Add new
              </Button>
            </div>
          </Box>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default MonthCalendarSheetTest;
