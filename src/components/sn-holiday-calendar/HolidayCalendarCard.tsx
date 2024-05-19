"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { NS_HOLIDAY_CALENDAR, NS_COMMON } from "constant/index";
import { DataStatus } from "constant/enums";
import {
  NewSelect as Select,
  IconButton,
  Text,
} from "components/shared";
import useToggle from "hooks/useToggle";
import { useFormik } from "hooks/useFormik";
import AddCircleGradientIcon from "icons/AddCircleGradientIcon";
import EditUnderlineIcon from "icons/EditUnderlineAltIcon";
import TrashIcon from "icons/TrashAltIcon";
import { useSnackbar } from "store/app/selectors";
import { HolidayCalendar } from "store/holidayCalendar/reducer";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";
import { getMessageErrorByAPI } from "utils/index";
import HolidayItems from "./HolidayItems";
import TitleInput from "./components/TitleInput";

type HolidayCalendarCardProps = {
  holidayCalendar: HolidayCalendar;
  handleOpenModal: (id: string) => void;
};

const HolidayCalendarCard = ({
  holidayCalendar,
  handleOpenModal,
}: HolidayCalendarCardProps) => {
  const commonT = useTranslations(NS_COMMON);
  const holidayCalendarT = useTranslations(NS_HOLIDAY_CALENDAR);
  const { onAddSnackbar } = useSnackbar();
  const [isEdit, , , toggleEdit] = useToggle(false);
  const {
    status,
    handleUpdateHolidayCalendar,
    handleDeleteHolidayCalendar,
    handleAddHolidayItem: reduxAddHolidayItem,
  } = useHolidayCalendar();

  const [selectedHolidayList, setSelectedHolidayList] = useState("");
  const [shouldReset, setShouldResetOn, setShouldResetOff] = useToggle(false);

  useEffect(() => {
    const currentList = holidayCalendar.list.find(
      (l) => +l.year === new Date().getFullYear(),
    );
    if (currentList) {
      setSelectedHolidayList(currentList.id);
    }
  }, [holidayCalendar]);

  const listYears = useMemo(
    () =>
      holidayCalendar.list
        .map((l) => ({
          label: `${l.year}`,
          value: l.id,
        }))
        .sort((l1, l2) => +l1.label - +l2.label),
    [holidayCalendar],
  );

  const initialValues = useMemo(
    () => ({
      id: holidayCalendar.id,
      name: holidayCalendar.name,
      country: holidayCalendar.country,
    }),
    [holidayCalendar],
  );

  const onSubmit = useCallback(
    async (values: typeof initialValues) => {
      await handleUpdateHolidayCalendar({ ...values, province: "" });
    },
    [handleUpdateHolidayCalendar],
  );

  const {
    values,
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur: formikHandleBlur,
    isSubmitDisabled,
  } = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isEdit) {
      setShouldResetOn();
    } else if (!isEdit && shouldReset) {
      resetForm();
      setShouldResetOff();
    }
  }, [isEdit, shouldReset, setShouldResetOn, setShouldResetOff, resetForm]);

  const handleBlur = useCallback(
    (e) => {
      formikHandleBlur(e);
      handleSubmit();
    },
    [formikHandleBlur, handleSubmit],
  );

  const handleSelectChange = useCallback(
    (e) => {
      handleChange(e);
      handleSubmit();
    },
    [handleChange, handleSubmit],
  );

  const handleAddHolidayItem = useCallback(() => {
    if (
      isEdit &&
      !isSubmitDisabled &&
      selectedHolidayList &&
      selectedHolidayList.length > 0
    ) {
      reduxAddHolidayItem({
        name: "New Holiday",
        date: dayjs().startOf("day").format("YYYY-MM-DD"),
        holidayListId: selectedHolidayList,
      });
    }
  }, [isEdit, isSubmitDisabled, selectedHolidayList, reduxAddHolidayItem]);

  return (
    <Stack
      direction="column"
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
      <Box component="form" noValidate>
        <Stack direction="row" alignItems="center">
            <TitleInput
              name="name"
              isEdit={isEdit}
              disabled={!isEdit || isSubmitDisabled}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              // error={commonT(touchedError("name"), {
              //   name: costRateT("empty.form.note"),
              // })}
            />
          <IconButton onClick={toggleEdit}>
            <EditUnderlineIcon />
          </IconButton>
          <IconButton
            sx={{ color: "#FF4141" }}
            disabled={status === DataStatus.LOADING || isSubmitDisabled}
            onClick={async () => {
              try {
                await handleDeleteHolidayCalendar(holidayCalendar.id);
                // setShouldFetchOn();
              } catch (error) {
                onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
              }
            }}
          >
            <TrashIcon />
          </IconButton>
        </Stack>

        <Grid
          container
          my={2}
          columnSpacing={3}
          rowSpacing={{
            xs: 2,
            sm: 3,
          }}
        >
          <Grid item xs={12} sm={4}>
            <Select
              options={[
                { label: "Viet Nam", value: "vietnam" },
                { label: "Japan", value: "japan" },
              ]}
              title={holidayCalendarT("form.country")}
              fullWidth
              name="country"
              disabled={!isEdit || isSubmitDisabled}
              onChange={handleSelectChange}
              onBlur={formikHandleBlur}
              value={values.country}
              // error={commonT(touchedError("country"), {
              //   name: costRateT("empty.form.country"),
              // })}
            />
          </Grid>

          <Grid item xs={11} sm={4}>
            <Select
              options={listYears}
              title={holidayCalendarT("form.year")}
              fullWidth
              name="year"
              disabled={!isEdit || isSubmitDisabled}
              onChange={(e) => {
                setSelectedHolidayList(e.target.value);
              }}
              value={selectedHolidayList}
              // error={commonT(touchedError("listId"), {
              //   name: costRateT("empty.form.year"),
              // })}
            />
          </Grid>

          <Grid item xs={1} mt={5}>
            <IconButton
              disabled={
                status === DataStatus.LOADING || isSubmitDisabled || !isEdit
              }
              onClick={() => {
                handleOpenModal(holidayCalendar.id);
              }}
            >
              <AddCircleGradientIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      <HolidayItems
        isEdit={isEdit}
        holidayCalendarId={holidayCalendar.id}
        holidayListId={selectedHolidayList}
      />

      <Stack direction="row" mt={2} justifyContent="end">
        <Stack
          direction="row"
          sx={{ cursor: "pointer" }}
          onClick={() => {
            if (
              !(status === DataStatus.LOADING || isSubmitDisabled || !isEdit)
            ) {
              handleAddHolidayItem();
            }
          }}
        >
          <AddCircleGradientIcon />
          <Text ml={1.5} color="#0575E6" fontWeight={700}>
            {holidayCalendarT("form.addHolidayItem")}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HolidayCalendarCard;
