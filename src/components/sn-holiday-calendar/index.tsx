"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";

import { DataStatus } from "constant/enums";
import { NS_COMMON, NS_HOLIDAY_CALENDAR } from "constant/index";
import {
  NewButton as Button,
  NewInput as Input,
  Text,
} from "components/shared";
import AddCircleGradientIcon from "icons/AddCircleGradientIcon";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";
import useToggle from "hooks/useToggle";
import useWindowSize from "hooks/useWindowSize";
import { useFormik } from "hooks/useFormik";
import HolidayCalendarCard from "./HolidayCalendarCard";

const HolidayCalendar = () => {
  const commonT = useTranslations(NS_COMMON);
  const holidayCalendarT = useTranslations(NS_HOLIDAY_CALENDAR);
  const [shouldFetch, , setShouldFetchOff] = useToggle(true);
  const {
    holidayCalendars,
    status,
    handleGetAllHolidayCalendar,
    handleAddHolidayCalendar,
    handleGetAllHolidayList,
    handleAddHolidayList,
  } = useHolidayCalendar();

  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const [modalHolidayCalendarId, setModalHolidayCalendarId] = useState("");

  const onSubmit = useCallback(
    (v: typeof initialValues) => {
      try {
        handleAddHolidayList({
          holiday_calendar_id: modalHolidayCalendarId,
          items: [],
          year: +v.year,
        });
        setModalHolidayCalendarId("");
        closeModal();
      } catch {}
    },
    [
      handleAddHolidayList,
      modalHolidayCalendarId,
      closeModal,
      setModalHolidayCalendarId,
    ],
  );

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
    resetForm,
  } = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  const handleOpenModal = useCallback(
    (id: string) => {
      setModalHolidayCalendarId(id);
      resetForm();
      openModal();
    },
    [setModalHolidayCalendarId, resetForm, openModal],
  );

  const onModalClose = useCallback(() => {
    setModalHolidayCalendarId("");
    closeModal();
  }, [closeModal, setModalHolidayCalendarId]);

  useEffect(() => {
    if (status !== DataStatus.LOADING && shouldFetch) {
      (async () => {
        await handleGetAllHolidayCalendar();
        await handleGetAllHolidayList();
      })();
      setShouldFetchOff();
    }
  }, [
    status,
    handleGetAllHolidayCalendar,
    handleGetAllHolidayList,
    shouldFetch,
    setShouldFetchOff,
  ]);

  const windowSize = useWindowSize();
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef();
  useEffect(() => {
    if (containerRef.current) {
      const top =
        (windowSize.height ?? 0) -
        getContainerBoundingClientRect(containerRef.current).top -
        5;
      setContainerHeight(top);
    }
  }, [windowSize]);

  return (
    <Box
      ref={containerRef}
      sx={{
        backgroundColor: "#F7F7FD",
        width: "100%",
        height: `${containerHeight}px`,
        overflowX: "hidden",
        overflowY: "scroll",
      }}
    >
      <Stack
        direction="column"
        sx={{
          width: "100%",
          pt: 2,
          pr: 10,
          pl: 4,
          pb: 8,
        }}
      >
        <Box
          component="button"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: `0 0 ${ADD_HOLIDAY_CALENDAR_BUTTON_HEIGHT}px`,
            mt: 2,
            border: "none",
            position: "relative",
            backgroundColor: "white",
            borderRadius: "24px",
            cursor: "pointer",
          }}
          onClick={async () => {
            await handleAddHolidayCalendar({
              name: "Holidays in Viet Nam",
              country: "Viet Nam",
              province: "",
            });
          }}
        >
          <Box
            position="absolute"
            width="100%"
            height={`${ADD_HOLIDAY_CALENDAR_BUTTON_HEIGHT}px`}
          >
            <svg
              x="0"
              y="0"
              width="100%"
              height={`${ADD_HOLIDAY_CALENDAR_BUTTON_HEIGHT}px`}
              preserveAspectRatio="none"
            >
              <rect
                width="100%"
                height={`${ADD_HOLIDAY_CALENDAR_BUTTON_HEIGHT}px`}
                fill="none"
                stroke="#14B9E6"
                strokeWidth="2px"
                strokeDasharray="8px 8px"
                rx="24px"
                ry="24px"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </Box>
          <AddCircleGradientIcon />
          <Text color="#0575E6" fontWeight={700} ml={2}>
            {holidayCalendarT("form.addHolidayCalendar")}
          </Text>
        </Box>

        {holidayCalendars.map((calendar) => (
          <HolidayCalendarCard
            key={calendar.id}
            holidayCalendar={calendar}
            handleOpenModal={handleOpenModal}
          />
        ))}
      </Stack>

      <DefaultPopupLayout
        open={isModalOpen}
        title={holidayCalendarT("form.addHolidayList")}
        onClose={onModalClose}
        sx={{ maxWidth: 450, borderRadius: 6 }}
      >
        <DialogContent>
          <Box onSubmit={handleSubmit} component="form" noValidate px={4}>
            <Input
              title={holidayCalendarT("form.year")}
              fullWidth
              name="year"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.year}
              // error={commonT(touchedErrors?.cost_per_month, {
              //   name: costRateT("empty.form.costPerMonth"),
              // })}
            />
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="center"
              py={3}
              spacing={3}
            >
              <Button variant="secondaryOutlined" onClick={onModalClose}>
                {commonT("form.cancel")}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitDisabled}
              >
                {commonT("form.confirm")}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </DefaultPopupLayout>
    </Box>
  );
};

export default HolidayCalendar;

const ADD_HOLIDAY_CALENDAR_BUTTON_HEIGHT = 80;

const initialValues = {
  year: "",
};

const getContainerBoundingClientRect = (element: HTMLElement) =>
  element.getBoundingClientRect();
