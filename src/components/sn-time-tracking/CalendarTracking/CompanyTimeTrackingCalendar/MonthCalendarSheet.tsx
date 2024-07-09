"use client";
import FullCalendar from "@fullcalendar/react";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";

function renderEventContent(eventInfo) {
  console.log(eventInfo);
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
const formatMonthYear = (monthYearString) => {
  const date = new Date(monthYearString);
  const month = date.toLocaleString('en-us', { month: 'short' }); // Get abbreviated month name
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const MonthCalendarSheet = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonthYear, setCurrentMonthYear] = useState("");

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
    const dayName = args.date.toLocaleString('default', { weekday: 'long' }); // Get full weekday name
    return (
      <div style={{ fontWeight: "600", fontSize: "12px", textAlign: "center", textTransform: "uppercase",color:"#757383" }}>
        {dayName}
      </div>
    );
  };


  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
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
        <Typography sx={{ color: "#0575E6", fontWeight: "700",fontSize:"17px" }}>
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
          events={[
            { title: "event 1", date: "2024-07-16" },
            { title: "event 2", date: "2019-04-02" },
          ]}
          eventContent={renderEventContent}
          headerToolbar={false}
          dayHeaderContent={customDayHeaderContent}
        />
        {selectedDate && (
          <Box>
            <Typography variant="h6">Selected Date: {selectedDate}</Typography>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default MonthCalendarSheet;
