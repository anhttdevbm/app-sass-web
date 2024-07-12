"use client";
import FullCalendar from "@fullcalendar/react";
import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";

interface Event {
  title: string;
  start: string;
  hours: number;
}

interface WeekTotal {
  start: Date;
  total: number;
}

const MonthCalendarSheet = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonthYear, setCurrentMonthYear] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [totals, setTotals] = useState<WeekTotal[]>([]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const formatMonthYear = (monthYearString) => {
    const date = new Date(monthYearString);
    const month = date.toLocaleString("en-us", { month: "short" }); // Get abbreviated month name
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const goNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      setCurrentMonthYear(formatMonthYear(calendarApi.view.title));
    }
  };
  const goPrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      setCurrentMonthYear(formatMonthYear(calendarApi.view.title));
    }
  };
  const customDayHeaderContent = (args) => {
    // Custom styling for day headers
    const dayName = args.date.toLocaleString("default", { weekday: "long" }); // Get full weekday name
    return (
      <div
        style={{
          fontWeight: "600",
          fontSize: "12px",
          textAlign: "center",
          textTransform: "uppercase",
          color: "#757383",
        }}
      >
        {dayName}
      </div>
    );
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    handleDrawerOpen();
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setCurrentMonthYear(formatMonthYear(calendarApi.view.title));
    }
  }, []);

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
        <IconButton onClick={goPrev}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          sx={{ color: "#0575E6", fontWeight: "700", fontSize: "17px" }}
        >
          {currentMonthYear}
        </Typography>
        <IconButton onClick={goNext}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          dateClick={handleDateClick}
          events={events}
          // eventContent={renderEventContent}
          headerToolbar={false}
          dayHeaderContent={customDayHeaderContent}
          editable={true}
        />
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerClose}
          style={{ width: 500 }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Selected Date Details</Typography>
            <Typography variant="body1">Date: {selectedDate}</Typography>
          </Box>
        </Drawer>
      </Box>
    </Stack>
  );
};

export default MonthCalendarSheet;
