"use client";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { DataStatus } from "constant/enums";
import { Text } from "components/shared";
import AddCircleGradientIcon from "icons/AddCircleGradientIcon";
import HolidayCalendarList from "./HolidayCalendarList";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";

const HolidayCalendar = () => {
  const {
    holidayCalendars,
    status,
    handleGetAllHolidayCalendar,
    handleGetAllHolidayList,
  } = useHolidayCalendar();

  useEffect(() => {
    if (status === DataStatus.IDLE) {
      (async () => {
        await handleGetAllHolidayCalendar();
        await handleGetAllHolidayList();
      })();
    }
  }, [status, handleGetAllHolidayCalendar, handleGetAllHolidayList]);

  return (
    <Stack
      direction="column"
      bgcolor="#F7F7FD"
      sx={{
        pt: 2,
        pr: 10,
        pl: 4,
        pb: 8,
        overflowX: "hidden",
      }}
    >
      <Box
        component="button"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: "0 0 112px",
          mt: 2,
          border: "1px dashed #14B9E6",
          backgroundColor: "white",
          borderRadius: "24px",
        }}
      >
        <AddCircleGradientIcon />
        <Text color="#0575E6" fontWeight={700} ml={2}>
          Add new holiday calendar
        </Text>
      </Box>

      {holidayCalendars.map((calendar) => (
        <HolidayCalendarList key={calendar.id} mode="edit" id={calendar.id} />
      ))}
    </Stack>
  );
};

export default HolidayCalendar;
