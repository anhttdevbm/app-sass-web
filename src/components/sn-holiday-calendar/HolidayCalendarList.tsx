"use client";
import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Formik } from "formik";

import { IconButton, Text } from "components/shared";
import useToggle from "hooks/useToggle";
import EditUnderlineIcon from "icons/EditUnderlineAltIcon";
import TrashIcon from "icons/TrashAltIcon";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";
import HolidayCalendarForm, {
  FormHolidayCalendar,
} from "./HolidayCalendarForm";

type HolidayCalendarListProps = {
  mode: "add" | "edit";
  id: string;
};

const HolidayCalendarList = ({ mode, id }: HolidayCalendarListProps) => {
  const [isEdit, , , toggleEdit] = useToggle(false);
  const { holidayCalendars } = useHolidayCalendar();

  const onSubmit = useCallback(() => {
    if (mode === "add") {
      return undefined;
    } else if (mode === "edit") {
      return undefined;
    }
  }, [mode]);

  const initialValues = useMemo(() => {
    const emptyValues: FormHolidayCalendar = {
      id: "",
      name: "",
      country: "",
      province: "",
      company: "",
      list: [],
    };
    if (mode === "edit") {
      const existingValues = holidayCalendars.find(
        (c) => c.id === id,
      );
      return existingValues ? existingValues as FormHolidayCalendar : emptyValues;
    }
    return emptyValues;
  }, [mode, id, holidayCalendars]);

  return (
    <Box
      sx={{
        mt: 3,
        pt: 3,
        pr: 6,
        pb: 6,
        pl: 4,
        backgroundColor: "white",
        borderRadius: "24px",
      }}
    >
      <Stack direction="row" alignItems="center">
        <Text variant="h3" fontSize="20px" fontWeight={600}>
          Holidays in Vietnam
        </Text>
        <IconButton onClick={toggleEdit}>
          <EditUnderlineIcon />
        </IconButton>
        <IconButton onClick={toggleEdit}>
          <TrashIcon />
        </IconButton>
      </Stack>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={onSubmit}
      >
        {(props) => <HolidayCalendarForm isEdit={isEdit} {...props} />}
      </Formik>
    </Box>
  );
};

export default HolidayCalendarList;
