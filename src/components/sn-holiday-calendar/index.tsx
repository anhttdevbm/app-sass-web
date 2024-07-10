"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import fuzzysort from "fuzzysort";
import * as Yup from "yup";

import { DataStatus } from "constant/enums";
import { NS_COMMON, NS_HOLIDAY_CALENDAR } from "constant/index";
import { NewInput, Text } from "components/shared";
import FormLayout from "components/NewFormLayout";
import useToggle from "hooks/useToggle";
import useWindowSize from "hooks/useWindowSize";
import { useFormik } from "hooks/useFormik";
import AddCircleGradientIcon from "icons/AddCircleGradientIcon";
import SearchIcon from "icons/SearchIcon";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";
import { HolidayCalendar as HolidayCalendarType } from "store/holidayCalendar/reducer";
import HolidayCalendarCard from "./HolidayCalendarCard";
import Input from "./components/Input";

const HolidayCalendar = () => {
  const commonT = useTranslations(NS_COMMON);
  const holidayCalendarT = useTranslations(NS_HOLIDAY_CALENDAR);
  const [shouldFetch, , setShouldFetchOff] = useToggle(true);
  const {
    holidayCalendars,
    status,
    handleGetAllHolidayCalendar,
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

  const existingHolidayYears = useMemo(() => {
    if (!modalHolidayCalendarId || modalHolidayCalendarId.length === 0) {
      return [];
    }
    const holidayCalendar = holidayCalendars.find(
      (c) => c.id === modalHolidayCalendarId,
    );
    if (!holidayCalendar) {
      return [];
    }
    return holidayCalendar.list.map((l) => +l.year);
  }, [holidayCalendars, modalHolidayCalendarId]);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        year: Yup.number()
          .typeError(
            commonT("form.error.typeError", {
              name: holidayCalendarT("form.year"),
              type: commonT("form.type.number").toLowerCase(),
            }),
          )
          .positive(
            commonT("form.error.positiveNumber", {
              name: holidayCalendarT("form.year"),
            }),
          )
          .required(
            commonT("form.error.required", {
              name: holidayCalendarT("form.year"),
            }),
          )
          .notOneOf(
            existingHolidayYears,
            commonT("form.error.existed", {
              name: holidayCalendarT("form.year"),
            }),
          ),
      }),
    [commonT, existingHolidayYears, holidayCalendarT],
  );

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isSubmitDisabled,
    touchedErrors,
  } = useFormik({
    initialValues,
    validationSchema,
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

  const [holidayCalendarSearchInput, setHolidayCalendarSearchInput] =
    useState("");

  const handleHolidayCalendarSearchChange = useCallback((e) => {
    setHolidayCalendarSearchInput(e.target.value);
  }, []);

  const sortedHolidayCalendars = useMemo(
    () =>
      holidayCalendars
        .filter(() => true)
        .sort(
          (c1, c2) =>
            new Date(c2.created_time).getTime() -
            new Date(c1.created_time).getTime(),
        ),
    [holidayCalendars],
  );
  const filteredHolidayCalendars = useMemo(
    () =>
      fuzzysort
        .go(holidayCalendarSearchInput, sortedHolidayCalendars, {
          keys: ["name", "country"],
          all: true,
        })
        .map((r) => r.obj),
    [holidayCalendarSearchInput, sortedHolidayCalendars],
  );

  const [
    isNewHolidayCalendarShown,
    showNewHolidayCalendar,
    hideNewHolidayCalendar,
  ] = useToggle(false);

  const handleAddHolidayCalendar = useCallback(() => {
    showNewHolidayCalendar();
  }, [showNewHolidayCalendar]);

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
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Input
            value={holidayCalendarSearchInput}
            onChange={handleHolidayCalendarSearchChange}
            name="holiday-calendar-search"
            placeholder={holidayCalendarT("form.searchHere")}
            endAdornment={
              <SearchIcon
                sx={{
                  flexGrow: 0,
                  flexShrink: 0,
                  fontSize: "16px",
                  marginRight: "12px",
                  color: "#0575E6",
                  cursor: "pointer",
                }}
              />
            }
            rootSx={{
              maxWidth: { xs: "initial", sm: "600px" },
              width: "initial",
              backgroundColor: "white",
            }}
            sx={{
              padding: "12px 24px",
              color: "rgba(0, 0, 0, 50%)",
            }}
          />
        </Box>
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
          onClick={handleAddHolidayCalendar}
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

        {isNewHolidayCalendarShown ? (
          <HolidayCalendarCard
            key="new-calendar"
            isNew={true}
            holidayCalendar={
              {
                id: "new-calendar",
                name: "",
                country: "",
                province: "",
                list: [],
                company: "",
                created_time: "",
                updated_time: "",
              } as HolidayCalendarType
            }
            handleOpenModal={handleOpenModal}
            hideNewHolidayCalendar={hideNewHolidayCalendar}
          />
        ) : (
          <></>
        )}
        {filteredHolidayCalendars.map((calendar) => (
          <HolidayCalendarCard
            key={calendar.id}
            isNew={false}
            holidayCalendar={calendar}
            handleOpenModal={handleOpenModal}
            hideNewHolidayCalendar={() => undefined}
          />
        ))}
      </Stack>

      <FormLayout
        open={isModalOpen}
        title={holidayCalendarT("form.addHolidayList")}
        onClose={onModalClose}
        onSubmit={handleSubmit}
        disabled={isSubmitDisabled}
        sx={{
          minWidth: { xs: "calc(100vw - 24px)", sm: 400 },
          maxWidth: { xs: "calc(100vw - 24px)", sm: 400 },
          minHeight: "auto",
        }}
        bottomProps={{
          sx: {
            pt: 3,
            pb: 5,
            px: 5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <NewInput
          title={holidayCalendarT("form.year")}
          fullWidth
          name="year"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.year}
          error={touchedErrors.year}
        />
      </FormLayout>
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
