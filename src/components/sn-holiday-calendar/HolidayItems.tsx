"use client";
import { useCallback, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

import { DataStatus } from "constant/enums";
import { NS_COST_RATE, NS_COMMON } from "constant/index";
import {
  NewInput as Input,
  NewDatePicker as DatePicker,
  IconButton,
} from "components/shared";
import useToggle from "hooks/useToggle";
import { useFormik } from "hooks/useFormik";
import TrashIcon from "icons/TrashAltIcon";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";

type HolidayItemsProps = {
  isEdit: boolean;
  holidayCalendarId: string;
  holidayListId: string;
};

const HolidayItems = ({
  isEdit = false,
  holidayCalendarId,
  holidayListId,
}: HolidayItemsProps) => {
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);

  const [shouldReset, setShouldResetOn, setShouldResetOff] = useToggle(false);
  const {
    status,
    selectHolidayList,
    handleUpdateHolidayList,
    handleDeleteHolidayItem,
  } = useHolidayCalendar();

  const initialValues = useMemo(
    () => ({
      id: holidayListId,
      items:
        selectHolidayList(holidayCalendarId, holidayListId)?.items.filter(
          () => true,
        ) ?? [],
    }),
    [holidayCalendarId, holidayListId, selectHolidayList],
  );

  const onSubmit = useCallback(
    async (values: typeof initialValues) => {
      const data = {
        ...values,
        items: values.items.map((item) => ({
          ...item,
          date: dayjs(item.date).format("YYYY-MM-DD"),
        })),
      };
      await handleUpdateHolidayList(data);
    },
    [handleUpdateHolidayList],
  );

  const {
    values,
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur: formikHandleBlur,
    handleChangeDate: formikHandleChangeDate,
    touchedError,
    isSubmitDisabled,
  } = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  const handleBlur = useCallback(
    (e) => {
      formikHandleBlur(e);
      handleSubmit();
    },
    [formikHandleBlur, handleSubmit],
  );

  const handleChangeDate = useCallback(
    (name, newDate) => {
      formikHandleChangeDate(name, newDate);
      handleSubmit();
    },
    [formikHandleChangeDate, handleSubmit],
  );

  useEffect(() => {
    if (isEdit) {
      setShouldResetOn();
    } else if (!isEdit && shouldReset) {
      resetForm();
      setShouldResetOff();
    }
  }, [isEdit, shouldReset, setShouldResetOn, setShouldResetOff, resetForm]);

  return (
    <>
      {values.items.map((holidayItem, idx) => (
        <Grid key={idx} container item xs={12} spacing={3}>

          <Grid item xs={12} sm={4}>
            <Input
              fullWidth
              name={`items[${idx}].name`}
              disabled={!isEdit}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.items[idx].name}
              // error={commonT(touchedError(`items[${idx}].name`), {
              //   name: costRateT("empty.form.note"),
              // })}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <DatePicker
              fullWidth
              name={`items[${idx}].date`}
              disabled={!isEdit}
              onChange={handleChangeDate}
              onBlur={handleBlur}
              value={values.items[idx].date}
              // error={commonT(touchedError(`items[${idx}].date`), {
              //   name: costRateT("empty.form.endDate"),
              // })}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <IconButton
              sx={{ color: "#FF4141" }}
              disabled={
                status === DataStatus.LOADING || isSubmitDisabled || !isEdit
              }
              onClick={async () => {
                await handleDeleteHolidayItem({
                  holidayListId: holidayListId,
                  id: holidayItem.id,
                });
                // setShouldFetchOn();
              }}
            >
              <TrashIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default HolidayItems;

// {currentListIdx > -1 ? (
//   values.list[currentListIdx].items.map((_, idx) => (
//   ))
// ) : (
//   <></>
// )}
