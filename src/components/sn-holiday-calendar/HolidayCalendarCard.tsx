"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { NS_HOLIDAY_CALENDAR, NS_COMMON } from "constant/index";
import { DataStatus } from "constant/enums";
import { Option } from "constant/types";
import { NewButton as Button, IconButton, Text } from "components/shared";
import useToggle from "hooks/useToggle";
import { useFormik } from "hooks/useFormik";
import AddCircleGradientIcon from "icons/AddCircleGradientIcon";
import AddCircleIcon from "icons/AddCircleIcon";
import EditUnderlineIcon from "icons/EditUnderlineAltIcon";
import GreenTickIcon from "icons/GreenTickIcon";
import SearchIcon from "icons/SearchIcon";
import TrashIcon from "icons/TrashAltIcon";
import { useSnackbar } from "store/app/selectors";
import { HolidayCalendar } from "store/holidayCalendar/reducer";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";
import { getMessageErrorByAPI } from "utils/index";
import HolidayItems from "./HolidayItems";
import TitleInput from "./components/TitleInput";
import Select from "./components/Select";
import Input from "./components/Input";

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
  const {
    status,
    handleUpdateHolidayCalendar,
    handleDeleteHolidayCalendar,
    handleAddHolidayItem: reduxAddHolidayItem,
  } = useHolidayCalendar();

  const [selectedHolidayList, setSelectedHolidayList] = useState("");
  const [shouldReset, setShouldResetOn, setShouldResetOff] = useToggle(false);

  useEffect(() => {
    if (!selectedHolidayList) {
      const sortedHolidayList = [
        ...holidayCalendar.list
          .filter((l) => +l.year >= new Date().getFullYear())
          .sort((l1, l2) => +l1.year - +l2.year),
        ...holidayCalendar.list
          .filter((l) => +l.year < new Date().getFullYear())
          .sort((l1, l2) => +l1.year - +l2.year),
      ];
      if (sortedHolidayList.length > 0) {
        setSelectedHolidayList(sortedHolidayList[0].id);
      } else {
        setSelectedHolidayList("");
      }
    }
  }, [holidayCalendar, selectedHolidayList]);

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

  const [isEdit, setEditOn, setEditOff] = useToggle(false);
  const titleRef = useRef<HTMLInputElement>(null);

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
    handleChange,
    setFieldValue,
    handleBlur,
    isSubmitDisabled,
    isSubmitting,
    submitForm,
  } = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  const toggleEdit = useCallback(async () => {
    if (isEdit) {
      await submitForm();
      setEditOff();
    } else {
      setEditOn();
    }
  }, [submitForm, isEdit, setEditOff, setEditOn]);

  const [countrySearch, setCountrySearch] = useState("");
  const countryList = useMemo(
    () =>
      (countrySearch === ""
        ? initialCountryList
        : initialCountryList.filter((option) =>
            option.label.toLowerCase().includes(countrySearch.toLowerCase()),
          )) as Option[],
    [countrySearch],
  );

  useEffect(() => {
    if (isEdit) {
      setShouldResetOn();
    } else if (!isEdit && shouldReset) {
      resetForm();
      setShouldResetOff();
    }
  }, [isEdit, shouldReset, setShouldResetOn, setShouldResetOff, resetForm]);

  useEffect(() => {
    if (isEdit) {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }
  }, [isEdit]);

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
            placeholder={holidayCalendarT("placeholder.holidayCalendarName")}
            // error={commonT(touchedError("name"), {
            //   name: costRateT("empty.form.note"),
            // })}
            inputRef={titleRef}
          />
          <IconButtonContainer>
            <IconButton size="small" onClick={toggleEdit}>
              {isEdit ? (
                <GreenTickIcon />
              ) : (
                <EditUnderlineIcon sx={{ color: "#333333" }} />
              )}
            </IconButton>
            <IconButton
              size="small"
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
          </IconButtonContainer>
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
            <StyledLabel>
              <span>{holidayCalendarT("form.country")}</span>
              <Select
                options={countryList}
                title={holidayCalendarT("form.country")}
                name="country"
                rootSx={{ width: "100%" }}
                disabled={!isEdit || isSubmitDisabled}
                onChange={(_, newVal) => {
                  setFieldValue("country", newVal);
                }}
                onBlur={handleBlur}
                value={values.country}
                endAdornment={isEdit ? undefined : <></>}
                topItem={
                  <Box px={2}>
                    <Input
                      name="country-search"
                      placeholder={holidayCalendarT(
                        "placeholder.countrySearch",
                      )}
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                      }}
                      startAdornment={
                        <SearchIcon
                          sx={{ marginLeft: "6px", color: "#172B4D" }}
                        />
                      }
                    />
                  </Box>
                }
                // error={commonT(touchedError("country"), {
                //   name: costRateT("empty.form.country"),
                // })}
              />
            </StyledLabel>
          </Grid>

          <Grid item xs={11} sm={4}>
            <StyledLabel>
              <span>{holidayCalendarT("form.year")}</span>
              <Select
                options={listYears}
                title={holidayCalendarT("form.year")}
                name="year"
                rootSx={{ width: "100%" }}
                disabled={!isEdit || isSubmitDisabled}
                onChange={(_, newVal) => {
                  setSelectedHolidayList(newVal as string);
                }}
                value={selectedHolidayList}
                endAdornment={isEdit ? undefined : <></>}
                bottomItem={
                  <Stack direction="row" justifyContent="center">
                    <Button
                      disabled={isSubmitDisabled}
                      pending={isSubmitting}
                      sx={{
                        "&.MuiButton-sizeMedium": {
                          px: 3,
                          py: 0.5,
                        },
                        "& .MuiButton-startIcon": {
                          display: "flex",
                          alignItems: "center",
                        },
                      }}
                      variant="primary"
                      type="button"
                      startIcon={<AddCircleIcon />}
                      onClick={() => {
                        handleOpenModal(holidayCalendar.id);
                      }}
                    >
                      {holidayCalendarT("form.addHolidayList")}
                    </Button>
                  </Stack>
                }
                // error={commonT(touchedError("listId"), {
                //   name: costRateT("empty.form.year"),
                // })}
              />
            </StyledLabel>
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

const StyledLabel = styled("label")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: "13px",
  fontWeight: 500,
  color: "#4D4D4D",
  // textTransform: "capitalize",
  display: "flex",
  flexDirection: "column",
  "& > span:first-of-type": {
    marginBottom: "12px",
  },
}));

const IconButtonContainer = styled(Stack)({
  flexDirection: "row",
  "& > *:not(.\\9)": {
    padding: "4px 8px",
    borderTop: "1px solid #D5D5D5",
    borderBottom: "1px solid #D5D5D5",
    borderLeft: "1px solid #D5D5D5",
    borderRadius: 0,
  },
  "& > :last-of-type:not(.\\9)": {
    borderRight: "1px solid #D5D5D5",
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
  "& > :first-of-type:not(.\\9)": {
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
  },
});

const initialCountryList = [
  { label: "Viet Nam", value: "vietnam" },
  { label: "Japan", value: "japan" },
  { label: "Singapore", value: "singapore" },
  { label: "Thailand", value: "thailand" },
  { label: "China", value: "china" },
];
